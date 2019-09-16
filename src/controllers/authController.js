const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const tokenService = require('../middlewares/tokenService');

const router = express.Router();

router.post('/register', async (req, res) => {

    const { username } = req.body;

    try {

        if(await User.findOne({ username })) {
            return res.status(400).send({ error : 'Username already exists'});
        }

        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({ user });
    }
    catch(err) {
        return res.status(400).send({ error : 'Registration failed'});
    }

});

router.post('/authenticate', async (req, res) => {

    const { username, password } = req.body;

    const user = await User.findOne({ username }).select('+password');

    if(!user) {
        res.status(400).send({ erro : 'User not found' });
    }

    if(!await bcrypt.compare(password, user.password)) {
        res.status(400).send({ error : 'Invalid password' });
    }

    user.password = undefined;

    res.send({ user, token : tokenService.genetareToken({ id : user.id }) });
});

module.exports = (app) => app.use('/auth', router);