const express = require('express');
const authService = require('../middlewares/authService');

const router = express.Router();
// router.use(authService); use authorization in all routes

router.get('', authService, (req, res) => {

    res.status(200).send({ ok : true});
});

module.exports = app => app.use('/gyms', router);