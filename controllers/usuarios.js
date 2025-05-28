const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');

const prisma = new PrismaClient();

const usuariosGet = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;

    const [total, usuarios] = await Promise.all([
        prisma.usuario.count({
            where: { estado: true }
        }),
        prisma.usuario.findMany({
            where: { estado: true },
            skip: Number(desde),
            take: Number(limite)
        })
    ]);

    res.json({ total, usuarios });
};

const usuariosPost = async (req, res = response) => {
    const { nombre, correo, password, rol } = req.body;

    const salt = bcryptjs.genSaltSync();
    const hashedPassword = bcryptjs.hashSync(password, salt);

    const usuario = await prisma.usuario.create({
        data: {
            nombre,
            correo,
            password: hashedPassword,
            rol
        }
    });

    res.json({ usuario });
};

const usuariosPut = async (req, res = response) => {
    const { id } = req.params;
    const { password, google, correo, ...resto } = req.body;

    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await prisma.usuario.update({
        where: { id },
        data: resto
    });

    res.json(usuario);
};

const usuariosDelete = async (req, res = response) => {
    const { id } = req.params;

    const usuario = await prisma.usuario.update({
        where: { id },
        data: { estado: false }
    });

    res.json(usuario);
};

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
};
