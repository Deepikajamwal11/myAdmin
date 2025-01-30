var express = require('express');
var router = express.Router();

let usercontroller = require('../controller/apicontroller/user');
let authcontroller = require('../controller/admincontroller/auth');
let middleware =require("../middleware/middleware")
let cmscontroller = require("../controller/admincontroller/cms");
let category = require('../controller/admincontroller/categeory');
let service = require('../controller/admincontroller/services');
let booking = require('../controller/admincontroller/booking');
let car = require('../controller/admincontroller/car');
let contactus = require('../controller/admincontroller/contactus');

// routes for admincontroller
router.get('/dashboard',authcontroller.dashboard);
router.post('/loginpost',authcontroller.loginpost);
router.get("/userlist",authcontroller.user_list);
router.get('/view/:_id', authcontroller.view);


router.post('/useredit/:_id',authcontroller.user_edit);
router.delete('/userdelete/:_id', authcontroller.delete_user);
router.post('/change_password',middleware.authenticateJWT,authcontroller.reset_password);


// routes for profile
router.get('/profile', middleware.authenticateJWT, authcontroller.profile);
router.post('/profileupdate', middleware.authenticateJWT, authcontroller.edit_profile); 

// routesfor user controller
router.post("/Createuser",usercontroller.user_create);
router.post('/userstatus',authcontroller.status);

// routes for cms
router.post('/cms', cmscontroller.createcms);
router.get("/privacy",cmscontroller.privacy_policy);
router.post("/privacypolicy", cmscontroller.privacypolicy);
router.get("/aboutus",cmscontroller.aboutus);
router.post("/updateabout", cmscontroller.updateabout);
router.get('/terms',cmscontroller.term);
router.post('/updateterm',cmscontroller.updateterm);

// route for logout
router.post('/logout', authcontroller.logout);

// route for graph
router.post('/graph', authcontroller.apexcharts);

// router for provider
router.get('/provider', authcontroller.provider_list);

//  router for workers
router.get('/worker', authcontroller.workers_list);

// router for categeory
router.post('/createCategory', category.createCategory);
router.get('/categorylist', category.Categorylist);
router.get('/viewcategory/:_id', category.categeoryview);
router.delete('/deletecategory/:_id', category.deletecategeory);
router.post('/categorystatus',category.status);

// router for services
router.post('/createservice', service.createService);
router.get('/services', service.servicelist);
router.get('/service/:_id', service.serviceView);
router.delete('/delete_service/:_id', service.deleteService);
router.post('/status', service.status);

// router for bookings
router.post('/createbooking',booking.createBooking);
router.get('/booking', booking.bookinglist);
router.get('/booking/:_id', booking.bookingView);
router.post('/bookingstatus', booking.status);
router.delete('/deletebooking/:_id',booking.deleteBooking);

// router for car
router.post('/createcar', car.createcar);
router.get('/carlist', car.carlist);
router.get('/carview/:_id', car.carview);
router.delete('/delete/:_id', car.delete);

// router for contact us
router.post('/createcontact', contactus.contact_create);
router.get('/getcontact',contactus.contact_get);
router.get('/viewcontact/:_id', contactus.contact_view);
router.post('/contactstatus', contactus.contact_status);
router.delete('/contactdelete/:_id', contactus.contact_delete);






module.exports = router;