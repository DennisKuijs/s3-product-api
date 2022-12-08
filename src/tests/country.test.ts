import App from '../app';
import CountryController from '../api/controllers/country.controller';
import validateEnv from '../api/utils/validateEnv';
import DBConnection from '../api/utils/DBConnection';
import request from 'supertest'
import 'dotenv/config';

let connection : any = null;

describe('Product API -> Countries', () => {

    beforeAll(async() => {
        validateEnv();
        connection = new App([new CountryController()], 0).express.listen()
    })

    afterAll(async() => {
        DBConnection.disconnectDB();
        connection.close();
    })

    it('GET /countries', async() => {
        const response : any = await request(connection).get('/api/v1/countries')
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({
            countries: expect.arrayContaining([
                expect.objectContaining({
                    name: expect.any(String),
                    short_name: expect.any(String),
                    calling_code: expect.any(String)
                })
            ])
        }))
    })

})