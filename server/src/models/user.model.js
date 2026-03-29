const mongoose = require('mongoose');
const { subscribe } = require('../app');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email must be unique"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    height: {
        type: Number,
        default: null
    },
    weight: {
        type: Number,
        default: null
    },
    verified: {
        type: Boolean,
        default: false
    },
    subscribe: {
        type: Boolean,
        default: false
    },
    subscribePlus: {
        type: Boolean,
        default: false
    }
})

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;