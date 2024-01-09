import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/app.js';

const { expect } = chai;
chai.use(chaiHttp);

// Suponiendo que estas son credenciales válidas de un usuario
const userCredentials = {
    username: 'caviles@caviles.com',
    password: '123asd'
};
let userToken = '';

describe('Session Routes', () => {
    // Test para iniciar sesión
    it('should login a user', (done) => {
        chai.request(server)
            .post('/api/sessions/login')
            .send(userCredentials)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('token');
                userToken = res.body.token; // Guardar el token para usarlo en tests posteriores
                done();
            });
    });

    // Test para cerrar sesión
    it('should logout a user', (done) => {
        chai.request(server)
            .get('/api/sessions/logout')
            .set('Authorization', `Bearer ${userToken}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    // Test para verificar la sesión de usuario
    it('should check user session', (done) => {
        chai.request(server)
            .get('/api/sessions/check')
            .set('Authorization', `Bearer ${userToken}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('isLoggedIn');
                done();
            });
    });
});
