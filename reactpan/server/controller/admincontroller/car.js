const helper = require('../../helper/helper');
const Car = require('../../models/car');
const { Validator } = require('node-input-validator');

module.exports = {
    createcar: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                carname: "required|string",
                model: "required|string", 
                image: "string",
                color: "string"
            });

            let errorsResponse = await helper.checkValidation(v);
            if (errorsResponse) {
                return helper.error(res, errorsResponse);
            }

            if (req.files && req.files.image) {
                let images = await helper.fileUpload(req.files.image);
                req.body.image = images;
            }

            const car = await Car.create({
                carname: req.body.carname,
                model: req.body.model,
                image: req.body.image,
                color: req.body.color,
            });

            return helper.success(res, "Car Created Successfully", { data: car });
        } catch (error) {
            console.error("Error creating car:", error);
            return helper.error(res, "Internal server error");
        }
    },
    
    carlist: async (req, res) => {
        try {
        
            const cars = await Car.find({});
      
            return helper.success(res, "All car details", {
                cars,
            });
        } catch (error) {
            console.log(error);
            return helper.error(res, "An error occurred", error);
        }
      },
      
    carview:async(req,res)=>{
       try {
        const car = await Car.findById({_id:req.params._id});
        return helper.success(res, "show car details", car);
       } catch (error) {
        console.log(error);
        return helper.error(res, "An error occurred", error);
       }
    },
    delete:async(req,res)=>{
      try {
        const car = await Car.findByIdAndDelete({_id:req.params._id});
        return helper.success(res, "delete car details", car);

      } catch (error) {
        console.log(error);
        return helper.error(res, "An error occurred", error);
      }
    },

};
