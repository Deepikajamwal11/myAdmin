const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  carname: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
}, { timestamps: true });

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
