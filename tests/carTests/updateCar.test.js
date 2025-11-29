import { AUTO_API_URL } from "../../constants/autoApiConstants"
import { expect, test, describe, beforeEach } from "@jest/globals";
import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import { faker } from '@faker-js/faker';
import CarsController from "../../controllers/carsController";
import AuthController from "../../controllers/AuthController";

describe("Update car", () => {
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

    test("Edit valid car", async () => {
        const carBrandsResponse = await carsController.getBrands(client)
        const carBrand = carBrandsResponse.data.data[0]
        const carModelsResponse = await carsController.getModels(client)
        const carModel = carModelsResponse.data.data[0]

        const createCarRequestBody = {
            "carBrandId": carBrand.id,
            "carModelId": carModel.id,
            "mileage": faker.number.int({ min: 1, max: 100_000 })
        }
        const createdCar = await carsController.createCar(createCarRequestBody)
        expect(createdCar.status).toBe(201)
        console.log("CREATED CAR TO EDIT:", createdCar.data.data)

        const editCarRequestBody = {
            "carBrandId": 2,
            "carModelId": 6,
            "mileage": faker.number.int({ min: 1, max: 100_000 })

        }

        console.log("CAR BRAND LOG:", carBrand)

        const expectEditedCarData = {
            "id": createdCar.data.data.id,
            "carBrandId": editCarRequestBody.carBrandId,
            "carModelId": editCarRequestBody.carModelId,
            "initialMileage": createdCar.data.data.initialMileage,
            "updatedMileageAt": expect.any(String),
            "carCreatedAt": expect.any(String),
            "mileage": editCarRequestBody.mileage,
            "brand": carBrandsResponse.data.data[editCarRequestBody.carBrandId - 1].title,
            "model": carModelsResponse.data.data[editCarRequestBody.carModelId - 1].title,
            "logo": carBrandsResponse.data.data[editCarRequestBody.carBrandId - 1].logoFilename
        }

        const editedCar = await carsController.updateCarById(createdCar.data.data.id, editCarRequestBody)

        console.log("EXPECTED EDITED CAR DATA:", expectEditedCarData)
        console.log("EDITED CAR:", editedCar.data.data)

        expect(editedCar.status).toBe(200)
        expect(editedCar.data.data).toEqual(expectEditedCarData)

    })

})