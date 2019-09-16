const mongoose = require('../database/index-db');

const ExerciseSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,

    },

    repetitions : {
        type: Number,
        required : true,
    },

    createdAt : {
        type : Date,
        default : Date.now,
    },
});

const Exercise = mongoose.model('Exercise', ExerciseSchema);

module.exports = Exercise;