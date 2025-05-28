// tests/usuariosPost.controller.test.js

// Mock de PrismaClient y su método usuario.create
jest.mock('@prisma/client', () => {
    return {
        PrismaClient: jest.fn().mockImplementation(() => ({
            usuario: {
                create: jest.fn().mockResolvedValue({
                    id: 'mocked-id',
                    nombre: 'Mock Usuario',
                    correo: 'mock@correo.com',
                    password: 'hashedpass',
                    rol: 'USER',
                    estado: true
                })
            }
        }))
    };
});

const { usuariosPost } = require('../controllers/usuarios');

describe('usuariosPost controller', () => {
    it('debería crear un nuevo usuario y devolverlo', async () => {
        // Simulamos la req.body con los datos necesarios
        const req = {
            body: {
                nombre: 'Mock Usuario',
                correo: 'mock@correo.com',
                password: 'password123',
                rol: 'USER'
            }
        };

        // Simulamos el objeto res con jest.fn() para capturar json()
        const res = {
            json: jest.fn()
        };

        // Ejecutamos la función que queremos testear
        await usuariosPost(req, res);

        // Verificamos que res.json haya sido llamado con el objeto esperado
        expect(res.json).toHaveBeenCalledWith({
            usuario: expect.objectContaining({
                id: 'mocked-id',
                nombre: 'Mock Usuario',
                correo: 'mock@correo.com',
                rol: 'USER',
                estado: true
            })
        });
    });
});
