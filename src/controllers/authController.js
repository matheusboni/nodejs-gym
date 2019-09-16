const express = require('express');

const User = require('../models/User');

const router = express.Router();

router.post('', async (req, res) => {

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

module.exports = (app) => app.use('/auth', router);

