const { Validator } = require("node-input-validator");
const helper = require('../../helper/helper');
const contactus = require('../../models/contactus');

module.exports = {
  contact_create: async (req, res) => {
    try {
      const v = new Validator(req.body, {
        email: "required|email",
      });

      let errorsResponse = await helper.checkValidation(v);
      if (errorsResponse) {
        return helper.error(res, errorsResponse);
      }

      const find_email = await contactus.findOne({ email: req.body.email });
      if (find_email) {
        return helper.error(res, "Contact already exists with that email");
      } 

        let data = await contactus.create({
          name: req.body.name,
          email: req.body.email,
          message: req.body.message,
          phone_no: req.body.phone_no,
        });

        return helper.success(res, "Contact Created Successfully", { data});
      
    } catch (error) {
      console.error("Error", error);
      return helper.error(res, "Internal server error");
    }
  },
  contact_get: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 5;

      const contacts = await contactus.find({})
        .skip((page - 1) * pageSize)
        .limit(pageSize);

      const totalContacts = await contactus.countDocuments(); 

      res.status(200).json({
        success: true,
        message: 'Contact list retrieved successfully',
        body: {
          contacts,
          totalContacts,
          totalPages: Math.ceil(totalContacts / pageSize),
          currentPage: page,
        },
      });
    } catch (error) {
      console.error('Error', error);
      return helper.error(res, 'Internal server error');
    }
  },
  contact_view:async(req,res)=>{
    try {
      const contact = await contactus.findById({_id:req.params._id})  
      res.status(200).json({
        success: true,
        message: "Contact list retrieved successfully",
        body: contact,
      });
    } catch (error) {
        console.error("Error", error);
        return helper.error(res, "Internal server error");
    }
  },
  contact_status: async (req, res) => {
    try {
      const { id, status } = req.body;
  
      
      if (status !== "0" && status !== "1") {
        return res.status(400).json({ message: "Invalid status value" });
      }
      const updatecontact = await contactus.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
  
      if (!updatecontact) {
        return res.status(404).json({ message: " not found" });
      }
      return res.status(200).json({ success: true, message: " status updated successfully" });
    } catch (error) {
      console.error("Error updating status:", error);
      return res.status(500).json({ message: "An error occurred while updating  status" });
    }
  },  
   contact_delete: async (req, res) => {
    try {
       
      const contact = await contactus.findByIdAndDelete({
        _id: req.params._id,
      })

        res.status(200).json({
            success: true,
            message: "Contact list retrieved successfully",
            body: contact,
          });
    } catch (error) {
        console.error("Error", error);
        return helper.error(res, "Internal server error");
    }
},

}
  
