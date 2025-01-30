const user = require("../../models/users");
const { Validator } = require("node-input-validator");
const helper = require('../../helper/helper');
const bcrypt = require('bcrypt');

module.exports = {
  user_create: async (req, res) => {
    try {
      const v = new Validator(req.body, {
        email: "required|email",
        password: "required|min:6", // You can enforce a minimum password length
        role: "required|integer",
      });
  
      let errorsResponse = await helper.checkValidation(v);
      if (errorsResponse) {
        return helper.error(res, errorsResponse);
      }
  
      const find_email = await user.findOne({ email: req.body.email });
      if (find_email) {
        return helper.error(res, "User already exists with that email");
      } else {
        if (req.files && req.files.image) {
          let images = await helper.fileUpload(req.files.image);
          req.body.image = images;
        }
  
        // Hash the password using bcrypt
        const salt = await bcrypt.genSalt(10); // Generate salt
        const hashedPassword = await bcrypt.hash(req.body.password, salt); // Hash the password
  
        let data = await user.create({
          role: req.body.role,
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword, // Use the hashed password
          address: req.body.address,
          phone_no: req.body.phone_no,
          image: req.body.image,
          status: req.body.status,
        });
  
        return helper.success(res, "User Created Successfully", { data });
      }
    } catch (error) {
      console.error("Error creating user:", error);
      return helper.error(res, "Internal server error");
    }
  }
}
