import BaseController from "./BaseController";

export default class AuthController extends BaseController {
    constructor(url) {
        super(url)
    }
    
    signUp(userData) {
        return this.client.post("/api/auth/signup", userData);
    }

    signIn(credentials) {
        return this.client.post("/api/auth/signin", credentials);
    }

}