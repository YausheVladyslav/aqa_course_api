import { expect, test, describe } from "@jest/globals";
import axios from 'axios';

describe.skip("Should create a correct post", () => {

    test.skip("Create a valid post", async () => {
        requestBody = {
            title: 'test title',
            body: 'test body',
            userId: 2,
        }

        const response = await axios.post('https://jsonplaceholder.typicode.com/posts', requestBody)

        console.log(response.data)
        expect(response.status).toEqual(201)

        expect(response.data).toMatchObject(
            {
                userId: expect.any(Number),
                id: 101,
                title: expect.any(String),
                body: expect.any(String)
            }
        )

          expect(response.data).toEqual(
            {
                id: 101,
                ...requestBody
            }
        )
    })


       test.skip("Create a post with an empty title", async () => {
        requestBody = {
            title: '',
            body: 'test body',
            userId: 2,
        }

        const response = await axios.post('https://jsonplaceholder.typicode.com/posts', requestBody)

        console.log(response.data)
        expect(response.status).toEqual(201)

        expect(response.data).toMatchObject(
            {
                userId: expect.any(Number),
                id: 101,
                title: expect.any(String),
                body: expect.any(String)
            }
        )

          expect(response.data).toEqual(
            {
                id: 101,
                ...requestBody
            }
        )
    })

    test.skip("Create a post with an empty body", async () => {
        requestBody = {
            title: 'test',
            body: '',
            userId: 2,
        }

        const response = await axios.post('https://jsonplaceholder.typicode.com/posts', requestBody)

        console.log(response.data)
        expect(response.status).toEqual(201)

        expect(response.data).toMatchObject(
            {
                userId: expect.any(Number),
                id: 101,
                title: expect.any(String),
                body: expect.any(String)
            }
        )

          expect(response.data).toEqual(
            {
                id: 101,
                ...requestBody
            }
        )
    })
})