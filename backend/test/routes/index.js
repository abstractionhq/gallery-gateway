import request from 'supertest';
import server from '../../server';

describe('API Routes', function() {  
    // Here it'll be tested two behaviors when try to find a task by id
    describe('GET /unknownroute', function() {
        // Testing the status 404 for task not found
        it('returns status 404 when id is not found', function(done) {
            request(server)
                .get('/unknownroute/')
                .expect(404, done)
        });
    });
});