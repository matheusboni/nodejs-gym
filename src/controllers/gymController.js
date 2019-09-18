const express = require('express');
const authService = require('../middlewares/authService');
const Serie = require('../models/serie');
const Exercise = require('../models/exercise');

const router = express.Router();
// router.use(authService); use authorization in all routes

//Get all series from authenticated user
router.get('/', authService, async (req, res) => {
    try {
        const series = await Serie.find({ user: req.userId }).populate(['user', 'physicalExercises']);
        res.status(200).send({ series });
    }
    catch (err) {
        return res.status(400).send({ error: 'Error listing series' })
    }
});

//Get a specific serie
router.get('/:serieId', authService, async (req, res) => {
    try {
        const serie = await Serie.findById(req.params.serieId).populate(['user', 'physicalExercises']);
        res.status(200).send({ serie });
    }
    catch (err) {
        return res.status(400).send({ error: 'Error finding serie' });
    }
});

//Create a new serie
router.post('/', authService, async (req, res) => {
    try {
        const { daysOfWeek, physicalExercises } = req.body;

        const serie = await Serie.create({ daysOfWeek, user: req.userId });

        await Promise.all(physicalExercises.map(async exercise => {
            const serieExercise = new Exercise({ ...exercise, serie: serie._id });

            await serieExercise.save();
            serie.physicalExercises.push(serieExercise);
        }));

        await serie.save();

        res.status(201).send({ serie });
    }
    catch (err) {
        return res.status(400).send({ error: 'Error creating serie' });
    }
});

//Update a existing serie
router.put('/:serieId', authService, async (req, res) => {
    try {
        const { daysOfWeek, physicalExercises } = req.body;

        const serie = await Serie.findByIdAndUpdate(req.params.serieId, { daysOfWeek }, { new: true });

        serie.physicalExercises = [];
        await Serie.remove({ serie: serie._id });

        await Promise.all(physicalExercises.map(async exercise => {
            const serieExercise = new Exercise({ ...exercise, serie: serie._id });

            await serieExercise.save();
            serie.physicalExercises.push(serieExercise);
        }));

        await serie.save();

        res.status(201).send({ serie });
    }
    catch (err) {
        return res.status(400).send({ error: 'Error updating serie' });
    }
});

//Delete one serie
router.delete('/:serieId', authService, async (req, res) => {
    try {
        await Serie.findByIdAndRemove(req.params.serieId);
        res.status(200).send({ message: 'Serie sucssefully removed' });
    }
    catch (err) {
        return res.status(400).send({ error: 'Error deleting serie' })
    }
});

module.exports = app => app.use('/series', router);