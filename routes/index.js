var express = require('express');
var router = express.Router();
const authcontroller = require('../controller/auth/authcontroller');
const admincontroller = require('../controller/admin/admincontroller');
const category = require('../controller/admin/categorycontroller');
const product = require('../controller/admin/productcontroller');
const booking = require('../controller/admin/bookingcontroller');
const cms = require('../controller/admin/cmscontroller');
const contactus = require('../controller/admin/contactuscontroller');

router.post('/createuser', authcontroller.createUser);
router.get('/login', admincontroller.login);
router.get('/otp', admincontroller.otpPage);
router.post('/verifyotp', admincontroller.verifyOtp);
router.get('/dashboard', admincontroller.dashboard);
router.post('/loginpost', admincontroller.loginpost);

//  router for password & passcode
router.get('/passcode',admincontroller.passcode);
router.post('/verifypasscode', admincontroller.verifypasscode);
router.get('/otppassword',admincontroller.otpPassword)
router.post('/verifypassword',admincontroller.verifyPassword);
router.get('/changepasscode',admincontroller.passcode_get);
 router.post('/updatepasscode',admincontroller.updatePasscode);  

// route for profile
router.get('/profile', admincontroller.profile);
router.post('/profileupdate', admincontroller.edit_profile);
router.get('/password', admincontroller.password);
router.post('/updatepassword', admincontroller.updatepassword);
router.get('/logout', admincontroller.logout);

// user routes
router.get('/userlist', admincontroller.user_list);
router.post('/status', admincontroller.user_status);
router.get('/view/:id', admincontroller.view);
router.post('/delete/:id', admincontroller.user_delete);

// category routes
router.post('/category', category.createcategory);
router.get('/categorylist', category.Categorylist);
router.post('/statuschange', category.status);
router.post('/deletes/:id', category.delete);
router.get('/categoryview/:id', category.categoryview);
router.get('/addcategory', category.addcategory);
router.get('/editcategory/:id', category.editcat);
router.post('/editcategory/:id', category.categoryedit);

//router.post('/product', product.createproduct);
router.post('/product', product.createproduct);
router.get('/productlist', product.getproduct);
router.post('/productstatus', product.status);
router.post('/deleted/:id', product.delete);
router.get('/productview/:id', product.productview);
router.get('/productadd', product.productadd);
router.get('/productedit/:id', product.producteditview);
router.post('/productedit/:id', product.productedit);

//routes for booking

router.post('/booking', booking.createBooking);
router.get('/bookinglist', booking.getBooking);
router.post('/bookingstatus', booking.bookingstatus);
router.post('/deletebooking/:id', booking.deletebooking);
router.get('/bookingview/:id', booking.bookingview);


// routes for cms
router.get('/privacy', cms.privacy);
router.post('/privacy', cms.privacy_update);
router.get('/aboutus', cms.aboutus);
router.post('/aboutus', cms.aboutusupdate);
router.get('/term', cms.term);
router.post('/term', cms.terms_update);

//routes for contactus
router.post('/createcontactus', contactus.createcontactus);
router.get('/contactus', contactus.getcontactus);
router.post('/deletecontact/:id', contactus.deletecontact);
router.get('/viewcontact/:id', contactus.contactview);  



module.exports = router;
