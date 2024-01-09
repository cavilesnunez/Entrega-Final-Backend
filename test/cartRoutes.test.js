import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/app.js';

const { expect } = chai;
chai.use(chaiHttp);

const userToken = 'USER_JWT_TOKEN'; // Reemplaza esto con un token válido para un usuario

describe('Cart Routes', () => {
    // Test para obtener un carrito por ID
    it('should return a cart by ID', (done) => {
        chai.request(server)
            .get('/api/carts/1') // Asume un ID de carrito válido
            .set('Authorization', `Bearer ${userToken}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    // Test para actualizar un carrito
    it('should update a cart', (done) => {
        chai.request(server)
            .put('/api/carts/1') // Asume un ID de carrito válido
            .set('Authorization', `Bearer ${userToken}`)
            .send({ /* datos para actualizar el carrito */ })
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    // Test para eliminar un carrito
    it('should delete a cart', (done) => {
        chai.request(server)
            .delete('/api/carts/1') // Asume un ID de carrito válido
            .set('Authorization', `Bearer ${userToken}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
});
