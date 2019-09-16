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

    
    weight : {
        type: Number,
        required : true,
    },

    serie : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Serie',
        required : true,
    },

    createdAt : {
        type : Date,
        default : Date.now,
    },
});

const Exercise = mongoose.model('Exercise', ExerciseSchema);

module.exports = Exercise;