import { AUTO_API_URL } from "../../constants/autoApiConstants"
import { expect, test, describe, beforeEach } from "@jest/globals";
import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import { faker } from '@faker-js/faker';
import CarsController from "../../controllers/carsController";
import AuthController from "../../controllers/AuthController";


describe("Create car", () => {
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


    test("Create car with valid data checking all brands and models", async () => {
        const carBrandsResponse = await carsController.getBrands(client)
        const carBransArray = carBrandsResponse.data.data
        console.log("CAR BRANDS: ", carBransArray, carBransArray.length)

        const carModelsResponse = await carsController.getModels(client)
        const carModelsArray = carModelsResponse.data.data
        console.log("CAR MODELS: ", carModelsArray, carModelsArray.length)

        for (const brand of carBransArray) {
            for (const model of carModelsArray) {
                if (model.carBrandId !== brand.id) continue;
                const createCarRequestBody = {
                    "carBrandId": brand.id,
                    "carModelId": model.id,
                    "mileage": faker.number.int({ min: 1, max: 100_000 })
                }
                const createdCar = await carsController.createCar(createCarRequestBody)
                const expectedCarData = {
                    "id": expect.any(Number),
                    "carBrandId": createCarRequestBody.carBrandId,
                    "carCreatedAt": expect.any(String),
                    "carModelId": createCarRequestBody.carModelId,
                    "initialMileage": createCarRequestBody.mileage,
                    "updatedMileageAt": expect.any(String),
                    "mileage": createCarRequestBody.mileage,
                    "brand": brand.title,
                    "model": model.title,
                    "logo": brand.logoFilename
                }
                // console.log("CREATED CAR:", createdCar.data.data)
                expect(createdCar.status).toBe(201)
                expect(createdCar.data.data).toMatchObject(createCarRequestBody)
                expect(createdCar.data.data).toEqual(expectedCarData)
            }
        }
    }, 10000)

    test("Create car without modelId should return 400", async () => {
        const carBrandsResponse = await carsController.getBrands(client)
        const carBrand = carBrandsResponse.data.data[0]

        const createCarRequestBody = {
            "carBrandId": carBrand.id,
            "mileage": faker.number.int({ min: 1, max: 100_000 })
        }

        const createdCar = await carsController.createCar(createCarRequestBody)
        console.log("CREATED CAR INVALID TEST:", createdCar.data)
        expect(createdCar.status).toBe(400)

    })

    test("Create car without brandId should return 400", async () => {
        const carModelResponse = await carsController.getModels(client)
        const carModel = carModelResponse.data.data[0]

        const createCarRequestBody = {
            "carModelId": carModel.id,
            "mileage": faker.number.int({ min: 1, max: 100_000 })
        }

        const createdCar = await carsController.createCar(createCarRequestBody)
        console.log("CREATED CAR INVALID TEST:", createdCar.data)
        expect(createdCar.status).toBe(400)

    })

    test("Create car without mileage should return 400", async () => {
        const carBrandsResponse = await carsController.getBrands(client)
        const carBrand = carBrandsResponse.data.data[0]

        const carModelResponse = await carsController.getModels(client)
        const carModel = carModelResponse.data.data[0]

        const createCarRequestBody = {
            "carBrandId": carBrand.id,
            "carModelId": carModel.id,
            // "mileage": faker.number.int({ min: 1, max: 100_000 })
        }

        const createdCar = await carsController.createCar(createCarRequestBody)
        console.log("CREATED CAR INVALID TEST:", createdCar.data)
        expect(createdCar.status).toBe(400)

    })

    test("Create car with negative mileage should return 400", async () => {
        const carBrandsResponse = await carsController.getBrands(client)
        const carBrand = carBrandsResponse.data.data[0]

        const carModelResponse = await carsController.getModels(client)
        const carModel = carModelResponse.data.data[0]

        const createCarRequestBody = {
            "carBrandId": carBrand.id,
            "carModelId": carModel.id,
            "mileage": -100
        }

        const createdCar = await carsController.createCar(createCarRequestBody)
        console.log("CREATED CAR INVALID TEST:", createdCar.data)
        expect(createdCar.status).toBe(400)

    })

    test("Create car with string in mileage should return 400", async () => {
        const carBrandsResponse = await carsController.getBrands(client)
        const carBrand = carBrandsResponse.data.data[0]

        const carModelResponse = await carsController.getModels(client)
        const carModel = carModelResponse.data.data[0]

        const createCarRequestBody = {
            "carBrandId": carBrand.id,
            "carModelId": carModel.id,
            "mileage": "invalid string"
        }

        const createdCar = await carsController.createCar(createCarRequestBody)
        console.log("CREATED CAR INVALID TEST:", createdCar.data)
        expect(createdCar.status).toBe(400)

    })

})