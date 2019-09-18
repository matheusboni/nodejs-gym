const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const tokenService = require('../middlewares/tokenService');
const authService = require('../middlewares/authService');

const router = express.Router();

//User registration
router.post('', async (req, res) => {

    const { username } = req.body;

    try {

        if (await User.findOne({ username })) {
            return res.status(400).send({ error: 'Username already exists' });
        }

        const user = await User.create(req.body);

        user.password = undefined;

        return res.staus(201).send({ user });
    }
    catch (err) {
        return res.status(400).send({ error: 'Registration failed' });
    }

});

//User authentication
router.post('/auth', async (req, res) => {

    const { username, password } = req.body;

    const user = await User.findOne({ username }).select('+password');

    if (!user) {
        res.status(400).send({ erro: 'User not found' });
    }

    if (!await bcrypt.compare(password, user.password)) {
        res.status(400).send({ error: 'Invalid password' });
    }

    user.password = undefined;

    res.send({ user, token: tokenService.generateToken({ id: user.id }) });
});

//Get informations from authenticated user
router.get('', authService, async (req, res) => {

    try {
        const user = await User.findOne({ _id: req.userId });

        res.status(200).send({ user });
    } catch (err) {
        return res.status(404).send({ error: 'User not found' });
    }
});

//update informations from authenticated user
router.put('', authService, async (req, res) => {

    const { username } = req.body;
    const authenticatedUser = await User.findById(req.userId).select('+password');

    try {

        if (await User.findOne({ username }) && (username != authenticatedUser.username)) {
            return res.status(400).send({ error: 'Username already exists' });
        }

        req.body.password = authenticatedUser.password;
        const user = await User.findByIdAndUpdate(req.userId, req.body, { new: true });

        user.password = undefined;

        return res.status(200).send({ user });
    }
    catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Update failed' });
    }

});

//delete user
router.delete('', authService, async (req, res) => {
    try {

        await User.findByIdAndRemove(req.userId);
        res.status(200).send({ message: 'User sucssefully removed' });

    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'User deleting failed' });
    }
});

module.exports = app => app.use('/users', router);