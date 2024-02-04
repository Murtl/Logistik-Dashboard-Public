import requests
import json
from getpass import getpass

class FirebaseConnector:

    def __init__(self, firebaseApiKey, serverAdress):

        self.firebaseApiKey = firebaseApiKey # API-Key from in firebase-project settings
        self.serverAdress = serverAdress
        self.idToken = "" # used for firebase authorization

    # Get firebase id token needed for authorization when sending data - token is valid for 60 minutes
    def getFirebaseIdToken(self):

        url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' + self.firebaseApiKey
        
        body = {
            'email': input("Bitte die E-Mail-Adresse des Firebase Auth Accounts eingeben: "),
            'password': getpass(),
            'returnSecureToken': True
        }
        
        response = requests.post(url, json=body)
        
        if response.status_code == 200:
            responseJSON = json.loads(response.text)
            self.idToken = responseJSON['idToken']
        else:
            print("Error: ", response.text)
            return("noIDToken")

    # Sends the file specified in filename to firestore - file has to be in the same directory as the calling file
    def postDataWOauth(self, filename, shippingCompanyId):
        
        # Check if we already have a token
        if(self.idToken != ''):
            
            url = self.serverAdress + '/api/companies/' + shippingCompanyId + '/upload'
            payload = {}
            headers = {'Authorization': 'Bearer ' + self.idToken}
            files=[('data-import',(filename ,open(filename,'rb'),'application/json'))]
        
            response = requests.request("POST", url, headers=headers, data=payload, files=files)

            if response.status_code == 200:
                print('Data posted successfully to Firebase!')
            elif(response.status_code == 401):
                print('ID Token not valid -> automatically call getFirebaseIdToken() and retry sending ')
                self.getFirebaseIdToken()
                self.postDataWOauth(filename, shippingCompanyId)
            else:
                print('Error:', response.text)
        
        else:
            self.getFirebaseIdToken()
            self.postDataWOauth(filename, shippingCompanyId)



    



