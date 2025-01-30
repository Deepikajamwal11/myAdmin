const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone_no: {
        type: String,
        required: false,
    },
    message: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        enum: ['0', '1'],
        default: '0',
    },
   
}, { timestamps: true });

const Contactus = mongoose.model("Contactus", contactSchema);
module.exports = Contactus;
