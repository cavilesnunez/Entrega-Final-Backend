import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/app.js';

const { expect } = chai;
chai.use(chaiHttp);

const adminToken = 'ADMIN_JWT_TOKEN'; // Reemplaza esto con un token válido para un usuario administrador

describe('Product Routes', () => {
    // Test para obtener productos
    it('should return all products', (done) => {
        chai.request(server)
            .get('/api/products')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });

    // Test para crear un nuevo producto
    it('should create a new product', (done) => {
        chai.request(server)
            .post('/api/products')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Nuevo Producto', price: 100 })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('name', 'Nuevo Producto');
                done();
            });
    });

    // Test para actualizar un producto
    it('should update a product', (done) => {
        chai.request(server)
            .put('/api/products/1') // Asume un ID de producto válido
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Producto Actualizado', price: 150 })
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    // Test para eliminar un producto
    it('should delete a product', (done) => {
        chai.request(server)
            .delete('/api/products/1') // Asume un ID de producto válido
            .set('Authorization', `Bearer ${adminToken}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
});
