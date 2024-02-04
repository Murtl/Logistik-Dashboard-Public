import createServer from "../../utils/server";
import firebase from "../../../firebase";
import supertest from "supertest";


const app = createServer();

const userPayload  = {
    email : "jest@supertest.com",
    password : "JestPW12345!",
    confirmPassword : "JestPW12345!",
    disabled : false,
    displayName : "Jest Supertest User"
}

const apiEndpoint : string = "/api/users/register";

let uid : string // UserID des Users um ihn anschließend wieder aus Firebase zu löschen.

describe("Create User Test", () => {

    afterAll(async () => {
       await firebase
           .auth()
           .deleteUser(uid);
    });

    describe(`POST : ${apiEndpoint}`, () => {
       describe("GIVEN: New user has been created", () => {
           it("SHOULD: Return a 201-Create status code and a JsonObject with user information.", async () => {
              const {statusCode, body} = await supertest(app)
                  .post(`${apiEndpoint}`)
                  .send(userPayload);

              uid = body.uid;

              expect(statusCode).toBe(201);
               expect(body).toEqual({
                   uid: expect.any(String),
                   email: userPayload.email,
                   emailVerified: false,
                   displayName: userPayload.displayName,
                   disabled: userPayload.disabled,
                   metadata: {
                       lastSignInTime: null,
                       creationTime: expect.any(String),
                       lastRefreshTime: null
                   },
                   tokensValidAfterTime: expect.any(String),
                   providerData: [
                       {
                           uid: userPayload.email,
                           displayName: userPayload.displayName,
                           email: userPayload.email,
                           providerId: "password"
                       }
                   ]
               });
           });
       });
        describe('GIVEN: User already exists.', () => {
            it("SHOULD: Return a 400-BadRequest status code and an errormessage", async () => {
               const {statusCode, body} = await supertest(app)
                   .post(`${apiEndpoint}`)
                   .send(userPayload);
               expect(statusCode).toBe(400);
                expect(body).toEqual({
                    message: "User could not be created!",
                    status: 400,
                    additionalInfo: {
                        code: "auth/email-already-exists",
                        message: "The email address is already in use by another account."
                    }
                });
            });
        });
    });

});