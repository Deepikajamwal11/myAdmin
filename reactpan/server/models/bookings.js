const mongoose = require('mongoose');


const User = require('../models/users'); 
const Services = require('../models/services'); 
const Car = require('../models/car');


const bookingSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    booking_code: {
        type: String,
        required: true,
    },
    
    service_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Services', 
        required: true,
    },
    car_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Car',
        required:false,
    },
    amount: {
        type: Number, 
        required: true,
    },
    no_of_booking: {
        type: Number, 
        required: false,
    },
    description: { 
        type: String,
        required: false,
    },
    status: {
        type: String,
        enum: ['0', '1'],
        default: '0',
    },
    location: {
        type: String,
        required: false,
    },
  
}, { timestamps: true });

const BookingModel = mongoose.model('Booking', bookingSchema); 

module.exports = BookingModel;
