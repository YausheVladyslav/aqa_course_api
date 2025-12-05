import BaseController from "./BaseController";

export default class CarsController extends BaseController {
    constructor(url) {
        super(url)
    }

    getBrands() {
        return this.client.get('/api/cars/brands')
    }


    getModels() {
        return this.client.get('/api/cars/models')
    }

    createCar(carData) {
        return this.client.post('/api/cars', carData)
    }

    getCarById(carId) {
        return this.client.get(`/api/cars/${carId}`)
    }

    updateCarById(carId, carData) {
        return this.client.put(`/api/cars/${carId}`, carData)
    }

    deleteCarById(carId) {
        return this.client.delete(`/api/cars/${carId}`)
    }

}