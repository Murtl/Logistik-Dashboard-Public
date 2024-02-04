import json
import random

# class Tour for generating the tours for the Tour array in JSON class
class Tour():
    
    def __init__(self, tourNumber, transportOperator, plannedShipments, plannedShipmentWeight, plannedShipmentVolume, plannedShipmentLoadingMeter, plannedShipmentStoringPositions, numberOfStops, kilometers, resource, performed):
        
        self.tourNumber = tourNumber
        self.transportOperator = transportOperator
        self.plannedShipments = plannedShipments
        self.plannedShipmentWeight = plannedShipmentWeight
        self.plannedShipmentVolume = plannedShipmentVolume
        self.plannedShipmentLoadingMeter = plannedShipmentLoadingMeter
        self.plannedShipmentStoringPositions = plannedShipmentStoringPositions
        self.numberOfStops = numberOfStops
        self.kilometers = kilometers
        self.resource = resource
        self.performed = performed
        
    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=0, ensure_ascii=False)

# class Tour for everything that is specific for one JSON-file
class JSON():
  
    def __init__(self, date, shippingCompany, amountShipments, amountPlannedShipments, totalPlannedShipmentsWeight, planningTime, reschedulingCount, availableTours, plannedTours):

        self.date = date
        self.shippingCompany = shippingCompany
        self.amountShipments = amountShipments
        self.amountPlannedShipments = amountPlannedShipments
        self.totalPlannedShipmentsWeight = totalPlannedShipmentsWeight
        self.planningTime = planningTime
        self.reschedulingCount = reschedulingCount
        self.availableTours = availableTours
        self.plannedTours = plannedTours
        self.tours = []

    # Tour-list gets created according to values from JSON-file
    def createToursFromOwnAttributes(self):
        i = 0
        while i < self.availableTours:
            
            global tourCounter
            tourTourNumber = prefixShippingCompany + str(tourCounter)
            tourCounter += 1


            tourTransportOperator = transportOperators[random.randint(0, 6)]
            
            tourResource = resourceTypes[random.randint(0, 4)]
            match tourResource:
                case "7,5 to":
                    tourPlannedShipments = random.randint(5, 100)
                    tourPlannedShipmentsWeight = random.randint(500, 2500)
                    tourPlannedShipmentsVolume = random.randint(100, 288)/10
                    tourPlannedShipmentsLoadingMeter = random.randint(10, 60)/10
                    tourPlannedShipmentsStoringPositions = random.randint(1, 6)
                case "12 to":
                    tourPlannedShipments = random.randint(5, 100)
                    tourPlannedShipmentsWeight = random.randint(1000, 5540)
                    tourPlannedShipmentsVolume = random.randint(100, 336)/10
                    tourPlannedShipmentsLoadingMeter = random.randint(10, 70)/10
                    tourPlannedShipmentsStoringPositions = random.randint(3, 17)
                case "16 to":
                    tourPlannedShipments = random.randint(5, 100)
                    tourPlannedShipmentsWeight = random.randint(1500, 7500)
                    tourPlannedShipmentsVolume = random.randint(100, 336)/10
                    tourPlannedShipmentsLoadingMeter = random.randint(10, 70)/10
                    tourPlannedShipmentsStoringPositions = random.randint(3, 17)
                case "16 to mit Anh.":
                    tourPlannedShipments = random.randint(5, 100)
                    tourPlannedShipmentsWeight = random.randint(1500, 13000)
                    tourPlannedShipmentsVolume = random.randint(100, 760)/10
                    tourPlannedShipmentsLoadingMeter = random.randint(40, 140)/10
                    tourPlannedShipmentsStoringPositions = random.randint(5, 36)
                case "Sprinter":
                    tourPlannedShipments = random.randint(5, 100)
                    tourPlannedShipmentsWeight = random.randint(200, 1100)
                    tourPlannedShipmentsVolume = random.randint(20, 153)/10
                    tourPlannedShipmentsLoadingMeter = random.randint(5, 32)/10
                    tourPlannedShipmentsStoringPositions = random.randint(1, 8)
                case _:
                    print("This shouldn't have happend!")

            tourNumberOfStops = random.randint(1, tourPlannedShipments)
            
            tourKilometer = tourNumberOfStops * random.randint(5, 50)
            while tourKilometer > 1000:
                tourKilometer = tourNumberOfStops * random.randint(5, 50)

            tourPlanned = True
                     
            self.tours.append(Tour(tourTourNumber, tourTransportOperator, tourPlannedShipments, tourPlannedShipmentsWeight, tourPlannedShipmentsVolume, tourPlannedShipmentsLoadingMeter, tourPlannedShipmentsStoringPositions, tourNumberOfStops, tourKilometer, tourResource, tourPlanned))
            i += 1

    def updateValues(self):

        counterAmountShipments = 0
        counterAmountPlannedShipments = 0
        counterAmountPlannedShipmentsWeight = 0

        counterTours = 0
        for tour in self.tours:
            if counterTours >= self.plannedTours:
                # Change tour to unplanned one
                counterAmountShipments += tour.plannedShipments
                tour.plannedShipmentWeight = 0
                tour.plannedShipmentVolume = 0
                tour.plannedShipmentLoadingMeter = 0
                tour.plannedShipmentStoringPositions = 0
                tour.numberOfStops = 0
                tour.kilometers = 0
                tour.performed = False
                counterTours += 1
            else:
                counterAmountShipments += tour.plannedShipments
                counterAmountPlannedShipments += tour.plannedShipments
                counterAmountPlannedShipmentsWeight += tour.plannedShipmentWeight
                counterTours += 1
                
        self.amountShipments = counterAmountShipments
        self.amountPlannedShipments = counterAmountPlannedShipments
        self.totalPlannedShipmentsWeight = counterAmountPlannedShipmentsWeight

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4, ensure_ascii=False)
    
    def saveToLocalFolder(self):
        filePathNameWExt = self.shippingCompany + "_" + self.date + ".json"
          
        with open(filePathNameWExt, 'w') as f:
            json_str = self.toJSON()
            f.write(json_str)
        
        return filePathNameWExt
    
# -------------------------------------------------------------------------------
# Global variables needed for generating appropriate data
# -------------------------------------------------------------------------------

# First company
shippingCompany = "Top Testspedition AG"
global prefixShippingCompany
prefixShippingCompany = "TT-"
tourCounter = 100000

transportOperators = ["eigene Durchführung", "Bayerische Post", "Fuchser", "Bayerischer Paketdienst", "STOP! Logistics", "Roman Schmied", "Andreas Meier"]

resourceTypes = ["7,5 to", "12 to", "16 to", "16 to mit Anh.", "Sprinter"]