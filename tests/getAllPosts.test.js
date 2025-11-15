import { expect, test, describe } from "@jest/globals";
import axios from 'axios';

describe("Should receive correct all posts", () => {

    test("Get all posts", async () => {

        const response = await axios.get(`https://jsonplaceholder.typicode.com/posts`)

        // console.log(response.data)
        expect(response.status).toEqual(200)

        for (const {userId, id, title, body} of response.data) {
                 expect({userId, id, title, body} ).toMatchObject(
            {
                userId: expect.any(Number),
                id: expect.any(Number),
                title: expect.any(String),
                body: expect.any(String)
    }
        )
        }
})
})