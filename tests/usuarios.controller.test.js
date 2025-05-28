const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

jest.mock('@prisma/client', () => {
    const mPrisma = {
        usuario: {
            count: jest.fn(),
            findMany: jest.fn()
        }
    };
    return { PrismaClient: jest.fn(() => mPrisma) };
});

const { usuariosGet } = require('../controllers/usuarios');

describe('usuariosGet', () => {
    let req, res, jsonMock;

    beforeEach(() => {
        req = {
            query: { limite: 2, desde: 0 }
        };

        jsonMock = jest.fn();

        res = {
            json: jsonMock
        };
    });

    it('debería devolver total y lista de usuarios activos', async () => {
        const mockUsuarios = [
            { id: 1, nombre: 'Juan', estado: true },
            { id: 2, nombre: 'María', estado: true }
        ];

        prisma.usuario.count.mockResolvedValue(2);
        prisma.usuario.findMany.mockResolvedValue(mockUsuarios);

        await usuariosGet(req, res);

        expect(prisma.usuario.count).toHaveBeenCalledWith({ where: { estado: true } });
        expect(prisma.usuario.findMany).toHaveBeenCalledWith({
            where: { estado: true },
            skip: 0,
            take: 2
        });

        expect(jsonMock).toHaveBeenCalledWith({
            total: 2,
            usuarios: mockUsuarios
        });
    });
});
