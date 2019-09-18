const mongoose = require('../database/index-db');
const Enum = require('enum');

// const days = new Enum({'MON': "Monday", 'TUE': "Tuesday", 'WED': "Wednesday", 'THU': "Thursday", 'FRI': "Friday", 'SAT': "Saturday", 'SUN': "Sunday"}); **search how use

const SerieSchema = new mongoose.Schema({
    daysOfWeek: [{
        type: String,
        required: true,
    }],

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    physicalExercises: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true,
    }],

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Serie = mongoose.model('Serie', SerieSchema);

module.exports = Serie;
