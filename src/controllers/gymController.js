const express = require('express');
const authService = require('../middlewares/authService');
const Serie = require('../models/serie');
const exercises = require('../models/exercise');

const router = express.Router();
// router.use(authService); use authorization in all routes

router.get('/', authService, async (req, res) => {
    try {
        const series = await Serie.find({ user : req.userId}).populate('user');
        res.status(200).send({ series });
    }
    catch(err) {
        return res.status(400).send({ error : 'Error listing series' })
    }
});

router.get('/:serieId', authService, async (req, res) => {
    try {
        const serie = await Serie.findById(req.params.serieId).populate('user');
        res.status(200).send({ serie });
    }
    catch(err) {
        return res.status(400).send({ error : 'Error finding serie' });
    }
});

router.post('/', authService, async (req, res) => {
    try {
        const serie = await Serie.create({ ...req.body, user : req.userId });

        res.status(201).send({ serie });
    }
    catch(err) {
        return res.status(400).send({ error : 'Error creating serie' });
    }
});

router.put('/:serieId', authService, async (req, res) => {
    try {
        res.status(200).send({ user : req.userId });
    }
    catch(err) {
        return res.status(400).send({ error : 'Error updating serie' });
    }
});

router.delete('/:serieId', authService, async (req, res) => {
    try {
        await Serie.findByIdAndRemove(req.params.serieId);
        res.status(404).send({ message : 'Serie sucssefully removed'});
    }
    catch(err) {
        return res.status(400).send({ error : 'Error deleting serie' })
    }
});

module.exports = app => app.use('/series', router);