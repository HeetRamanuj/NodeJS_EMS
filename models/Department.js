const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const departmentSchema = new mongoose.Schema({
    departmentName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model for manager
        required: true
    },
});

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;
