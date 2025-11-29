import { AUTO_API_URL } from "../../constants/autoApiConstants"
import { expect, test, describe, beforeEach } from "@jest/globals";
import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import { faker } from '@faker-js/faker';
import CarsController from "../../controllers/carsController";
import AuthController from "../../controllers/AuthController";

describe("Get car", () => {
    const jar = new CookieJar()
    const client = wrapper(axios.create({
        baseURL: AUTO_API_URL,
        validateStatus: () => true,
        jar
    }))

    const carsController = new CarsController(client)
    const authController = new AuthController(client)

    beforeEach(async () => {

        const password = `Testqa${faker.number.int({ min: 100, max: 1000 })}`
        const userData = {
            "name": faker.person.firstName(),
            "lastName": faker.person.lastName(),
            "email": faker.internet.email(),
            "password": password,
            "repeatPassword": password
        }

        const signedUpUser = await authController.signUp(userData)
        expect(signedUpUser.status).toBe(201)
        console.log("SIGNED UP USER BEFORE EACH:", signedUpUser.data)

        const loggedInUser = await authController.signIn({
            "email": userData.email,
            "password": userData.password,
            "remember": false
        })
        console.log("LOGGED IN USER BEFORE EACH:", loggedInUser.data)
        expect(loggedInUser.status).toBe(200)
    })

    test("Get valid car by id should return 200", async () => {
        const carBrandsResponse = await carsController.getBrands(client)
        const carBrandsArray = carBrandsResponse.data.data
        const anyBrandIndex = faker.number.int({ min: 0, max: carBrandsArray.length - 1 })

        const carModelsResponse = await carsController.getModels(client)
        const carModelsArray = carModelsResponse.data.data
        const anyOtherModelIndexArray = carModelsArray.filter((model) => model.carBrandId === carBrandsArray[anyBrandIndex].id)
        const anyOtherModelIndex = anyOtherModelIndexArray[faker.number.int({ min: 0, max: anyOtherModelIndexArray.length - 1 })]

        const createCarRequestBody = {
            "carBrandId": carBrandsArray[anyBrandIndex].id,
            "carModelId": anyOtherModelIndex.id,
            "mileage": faker.number.int({ min: 1, max: 100_000 })
        }
        const createdCar = await carsController.createCar(createCarRequestBody)
        expect(createdCar.status).toBe(201)

        const getCarResponse = await carsController.getCarById(createdCar.data.data.id)
        console.log("GET TEST CAR RESPONSE:", getCarResponse.data.data)
        console.log("GET TEST CREATED CAR:", createdCar.data.data)
        expect(getCarResponse.status).toBe(200)
        expect(getCarResponse.data.data).toEqual(createdCar.data.data)
    })

    test("Get car by not existing id should return 404", async () => {
        const getCarResponse = await carsController.getCarById(9999999)
        const expectedErrorResponse = {
            "status": "error",
            "message": "Car not found"
        }

        console.log("GET TEST CAR RESPONSE NOT EXISTING:", getCarResponse.data.data)
        expect(getCarResponse.status).toBe(404)
        expect(getCarResponse.data).toEqual(expectedErrorResponse)
    })

})