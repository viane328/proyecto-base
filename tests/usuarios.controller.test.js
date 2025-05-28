// tests/usuarios.controller.test.js
const { usuariosGet, usuariosPost, usuariosPut, usuariosDelete } = require('../controllers/usuarios.controller');
const bcryptjs = require('bcryptjs');

// Mock básico para documentos Firestore
const mockDoc = (id, data) => ({
  id,
  data: () => data
});

// Mock manual del módulo firestore.config con mockDb definido dentro
jest.mock('../database/firestore.config', () => {
  const mockDb = {
    collection: jest.fn()
  };
  return { db: mockDb };
});

// Importamos el mockDb para usar en los tests
const { db: mockDb } = require('../database/firestore.config');

describe('Usuarios Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('usuariosGet', () => {
    it('debe devolver usuarios activos con status 200', async () => {
      const usuarios = [
        mockDoc('1', { nombre: 'User1', estado: true }),
        mockDoc('2', { nombre: 'User2', estado: true }),
        mockDoc('3', { nombre: 'User3', estado: true }),
      ];

      const mockSnapshot = {
        empty: false,
        forEach: (callback) => usuarios.forEach(callback)
      };

      const getMock = jest.fn().mockResolvedValue(mockSnapshot);
      const whereMock = jest.fn(() => ({ get: getMock }));
      const collectionMock = {
        where: whereMock,
        get: getMock,
      };

      mockDb.collection.mockReturnValue(collectionMock);

      // Simulamos req y res
      const req = { query: { limite: '2', desde: '1' } };
      const res = { json: jest.fn() };

      await usuariosGet(req, res);

      expect(res.json).toHaveBeenCalledWith({
        total: usuarios.length,
        usuarios: [
          { id: '2', nombre: 'User2', estado: true },
          { id: '3', nombre: 'User3', estado: true }
        ]
      });
    });
  });

  describe('usuariosPost', () => {
    it('debe crear un nuevo usuario y devolverlo', async () => {
      const addMock = jest.fn().mockResolvedValue({ id: 'abc123' });
      mockDb.collection.mockReturnValue({ add: addMock });

      const req = {
        body: {
          nombre: 'Nuevo Usuario',
          correo: 'nuevo@mail.com',
          password: '123456',
          rol: 'USER_ROLE'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await usuariosPost(req, res);

      expect(addMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        msg: 'Usuario creado en Firebase',
        id: 'abc123',
        usuario: expect.objectContaining({
          nombre: 'Nuevo Usuario',
          correo: 'nuevo@mail.com',
          rol: 'USER_ROLE'
        })
      }));
    });
  });

  describe('usuariosPut', () => {
    it('debe actualizar un usuario y devolverlo', async () => {
      const updateMock = jest.fn().mockResolvedValue();
      const getMock = jest.fn().mockResolvedValue(mockDoc('abc123', {
        nombre: 'Usuario Actualizado',
        correo: 'actualizado@mail.com',
        estado: true
      }));

      const docMock = {
        update: updateMock,
        get: getMock
      };

      mockDb.collection.mockReturnValue({
        doc: jest.fn().mockReturnValue(docMock)
      });

      const req = {
        params: { id: 'abc123' },
        body: { nombre: 'Usuario Actualizado', password: 'nuevopass' }
      };

      const res = {
        json: jest.fn()
      };

      // Mock bcryptjs para evitar hashing real en test
      jest.spyOn(bcryptjs, 'genSaltSync').mockReturnValue('salt');
      jest.spyOn(bcryptjs, 'hashSync').mockReturnValue('hashedpassword');

      await usuariosPut(req, res);

      expect(updateMock).toHaveBeenCalledWith(expect.objectContaining({
        nombre: 'Usuario Actualizado',
        password: 'hashedpassword'
      }));

      expect(res.json).toHaveBeenCalledWith({
        id: 'abc123',
        nombre: 'Usuario Actualizado',
        correo: 'actualizado@mail.com',
        estado: true
      });
    });
  });

  describe('usuariosDelete', () => {
    it('debe marcar usuario como inactivo y devolverlo', async () => {
      const updateMock = jest.fn().mockResolvedValue();
      const getMock = jest.fn().mockResolvedValue(mockDoc('abc123', {
        nombre: 'Usuario Borrado',
        estado: false
      }));

      const docMock = {
        update: updateMock,
        get: getMock
      };

      mockDb.collection.mockReturnValue({
        doc: jest.fn().mockReturnValue(docMock)
      });

      const req = {
        params: { id: 'abc123' }
      };

      const res = {
        json: jest.fn()
      };

      await usuariosDelete(req, res);

      expect(updateMock).toHaveBeenCalledWith({ estado: false });

      expect(res.json).toHaveBeenCalledWith({
        msg: 'Usuario marcado como inactivo',
        id: 'abc123',
        nombre: 'Usuario Borrado',
        estado: false
      });
    });
  });
});