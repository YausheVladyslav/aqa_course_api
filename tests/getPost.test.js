import { expect, test, describe } from "@jest/globals";
import axios from 'axios';

describe.skip("Should receive a correct post", () => {

    test.skip("Get a post", async () => {
        postId = 3

        const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`)

        console.log(response.data)
        expect(response.status).toEqual(200)

        expect(response.data).toMatchObject(
            {
                userId: expect.any(Number),
                id: postId,
                title: expect.any(String),
                body: expect.any(String)
    }
        )
})
})