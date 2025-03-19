const bcrypt = require('bcrypt');
const { Validator } = require('node-input-validator');
const db = require('../../models');
const helper = require('../../helper/helper')

module.exports = {
  dashboard: async (req, res) => {
    try {
      if (!req.session.admin) {
        return res.redirect("/login");
      }
      const user = await db.users.count({ where: { role: '1' } });
      const category = await db.category.count({});
      const product = await db.products.count({});
      const usersByMonth = await db.users.findAll({
        where: { role: '1' },
        attributes: [
          [db.Sequelize.fn('MONTH', db.Sequelize.col('createdAt')), 'month'],
          [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'count']
        ],
        group: ['month'],
        order: [[db.Sequelize.fn('MONTH', db.Sequelize.col('createdAt')), 'ASC']],
        raw: true
      });
      const chartData = Array(12).fill(0);
      usersByMonth.forEach(item => {
        chartData[item.month - 1] = parseInt(item.count, 10);
      });

      res.render("dashboard", {
        session: req.session.admin,
        title: "Dashboard",
        user,
        category,
        product,
        chartData,

      });
    } catch (error) {
      console.error("Error rendering dashboard:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  login: async (req, res) => {
    try {
      res.render('login');
    } catch (error) {
      console.error('Error rendering login page:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  loginpost: async (req, res) => {
    try {
      const { email, password } = req.body;
      const find_user = await db.users.findOne({ where: { email, role: '0' } });

      if (!find_user) {
        req.flash("error", "Email not found");
        return res.redirect('/login');
      }
      const storedHash = find_user.password;
      const is_password = await bcrypt.compare(password, storedHash);
      if (!is_password) {
        req.flash("error", "Incorrect password");
        return res.redirect('/login');
      }

      req.session.userId = find_user.id;
      return res.redirect('/otp');

    } catch (error) {
      req.flash("error", "An error occurred");
      return res.redirect('/login');
    }
},

  otpPage: async (req, res) => {
    try {
      const user = await db.users.findOne({ where: { id: req.session.userId } });

      if (!user || !user.otp) {
        req.flash("error", "OTP not found");
        return res.redirect('/login');
      }

      res.render('otp', { userId: req.session.userId });
    } catch (error) {
      console.error('Error rendering OTP page:', error);
      req.flash("error", "Error while rendering OTP page");
      return res.redirect('/login');
    }
  },
  verifyOtp: async (req, res) => {
    try {
      const otp = req.body.otp1 + req.body.otp2 + req.body.otp3 + req.body.otp4;
      const user = await db.users.findOne({ where: { id: req.session.userId } });

      if (!user || !user.otp) {
        req.flash("error", "OTP not found");
        return res.redirect('/login');
      }
      if (otp === user.otp) {
        req.session.admin = user;
        req.flash("success", "You are logged in successfully");
        return res.redirect('/dashboard');
      } else {
        req.flash("error", "Invalid OTP");
        return res.redirect('/login');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      req.flash("error", "Error while verifying OTP");
      return res.redirect('/login');
    }
  },
  passcode: async (req, res) => {
    try {

      if (!req.session.admin) {
        return res.redirect("/login");
      }
      const admin = await db.users.findOne({
        where: { id: req.session.admin.id }
      });

      res.render("admin/passcode", {
        session: req.session.admin,
        admin

      });

    } catch (error) {
      console.error('Error rendering profile:', error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  verifypasscode: async (req, res) => {
    try {
      if (!req.session.admin) {
        return res.redirect("/login");
      }
      const Passcode = req.body.otp1 + req.body.otp2 + req.body.otp3 + req.body.otp4;
      const admin = await db.users.findOne({ where: { id: req.session.admin.id } });
      if (!admin) {
        req.flash("error", "Admin not found.");
        return res.redirect("/login");
      }
      if (Passcode === admin.pass_code) {
        req.flash('success', 'Profile fetch successfully');
        return res.redirect("/password");
      } else {
        req.flash("error", "Invalid passcode. Please try again.");
        return res.redirect("/dashboard");
      }
    } catch (error) {
      console.error("Error verifying passcode:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  profile: async (req, res) => {
    try {

      if (!req.session.admin) {
        return res.redirect("/login");
      }
      const profile = await db.users.findOne({
        where: { email: req.session.admin.email },
      });

      res.render("admin/profile.ejs", {
        session: req.session.admin,
        profile,
        title: "Profile"
      });

    } catch (error) {
      console.error('Error rendering profile:', error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  edit_profile: async (req, res) => {
    try {
      if (!req.session.admin) return res.redirect("/login");
      let updatedata = { ...req.body }
      let folder = "admin";
      if (req.files && req.files.image) {
        let images = await helper.fileUpload(req.files.image, folder);
        updatedata.image = images;
      }
      const profile = await db.users.update(updatedata, {
        where: {
          id: req.session.admin.id,
        },
      });
      const find_data = await db.users.findOne({
        where: {
          id: req.session.admin.id,
        },
      });
      req.session.admin = find_data;
      req.flash("success", " Update Profile succesfully ");
      res.redirect("/profile");
    } catch (error) {
      console.log(error);
      return helper.error(res, error);
    }
  },
  password: async (req, res) => {
    try {
      if (!req.session.admin) return res.redirect("/login");
      res.render('admin/changepassword',
        {
          session: req.session.admin,
          title: "change password"
        });
    } catch (error) {
      console.log(error, 'error')
    }
  },
  // updatepassword: async (req, res) => {
  //   const { oldPassword, newPassword, confirmPassword } = req.body;

  //   try {
  //     if (!req.session.admin) return res.redirect("/login");
  //     if (!oldPassword || !newPassword || !confirmPassword) {
  //       return res.status(400).json({ message: 'All fields are required' });
  //     }
  //     if (newPassword !== confirmPassword) {
  //       req.flash("error", "New password and confirm password do not match");
  //       return res.status(400).json({ message: 'New password and confirm password do not match' });
  //     }
  //     const user = await db.users.findOne({ where: { id: req.session.admin.id } });
  //     if (!user) {
  //       return res.status(404).json({ message: 'User not found' });
  //     }
  //     const isMatch = await bcrypt.compare(oldPassword, user.password);
  //     if (!isMatch) {
  //       req.flash("error", "Old password is incorrect");
  //       return res.status(400).json({ message: 'Old password is incorrect' });
  //     }
  //     const hashedPassword = await bcrypt.hash(newPassword, 10);
  //     user.password = hashedPassword;
  //     await user.save();
  //     req.session.admin.password = hashedPassword;
  //     req.flash("success", "Password updated successfully");
  //     res.redirect('/login'); 
  //   } catch (error) {
  //     console.error('Error updating password:', error);
  //     req.flash("error", "Server error");
  //     res.status(500).json({ message: 'Server error' });
  //   }
  // },
  updatepassword: async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    try {
      if (!req.session.admin) return res.redirect("/login");

      if (!oldPassword || !newPassword || !confirmPassword) {
        req.flash("error", "All fields are required");
        return res.status(400).json({ message: 'All fields are required' });
      }

      if (newPassword !== confirmPassword) {
        req.flash("error", "New password and confirm password do not match");
        return res.status(400).json({ message: 'New password and confirm password do not match' });
      }

      const user = await db.users.findOne({ where: { id: req.session.admin.id } });
      if (!user) {
        req.flash("error", "User not found");
        return res.status(404).json({ message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        req.flash("error", "Old password is incorrect");
        return res.status(400).json({ message: 'Old password is incorrect' });
      }

      const newOtp = crypto.randomInt(1000, 9999).toString();
      user.otp = newOtp;
      req.session.newPassword = await bcrypt.hash(newPassword, 10);
      await user.save();

      req.flash("success", "OTP sent. Please verify to proceed.");
      res.redirect('/otppassword');

    } catch (error) {
      console.error('Error updating password:', error);
      req.flash("error", "Server error");
      res.status(500).json({ message: 'Server error' });
    }
  },
  otpPassword: async (req, res) => {
    try {
      const user = await db.users.findOne({ where: { id: req.session.admin.id } });

      if (!user || !user.otp) {
        req.flash("error", "OTP not found");
        return res.redirect('/login');
      }

      res.render('admin/passwordotp', { userId: req.session.admin.id });
    } catch (error) {
      console.error('Error rendering OTP page:', error);
      req.flash("error", "Error while rendering OTP page");
      return res.redirect('/login');
    }
  },
  verifyPassword: async (req, res) => {
    try {
      const otp = req.body.otp1 + req.body.otp2 + req.body.otp3 + req.body.otp4;

      const user = await db.users.findOne({ where: { id: req.session.admin.id } });
      if (!user || !user.otp) {
        req.flash("error", "OTP not found or expired");
        return res.redirect('/login');
      }

      if (otp === user.otp) {
        user.password = req.session.newPassword;
        // user.otp = "";  // Clear OTP after successful verification
        await user.save();
        req.session.newPassword = null;
        req.session.admin = user;
        req.flash("success", "Password updated successfully. You are logged in.");
        return res.redirect('/login');
      } else {
        req.flash("error", "Invalid OTP");
        return res.redirect('/login');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      req.flash("error", "Error while verifying OTP");
      return res.redirect('/login');
    }
  },
  passcode_get: async (req, res) => {
    try {
      if (!req.session.admin) return res.redirect("/login");
      res.render('admin/passcodepage',
        {
          session: req.session.admin,
          title: "Passcode"
        });
    } catch (error) {
      console.log(error, 'error')
    }
  },
  updatePasscode: async (req, res) => {
    const { oldpasscode, newpasscode, confirmpasscode } = req.body;
    try {
      if (!req.session.admin) {
        req.flash("error", "You must be logged in to update the passcode.");
        return res.redirect("/login");
      }
      if (!oldpasscode || !newpasscode || !confirmpasscode) {
        req.flash("error", "All fields are required.");
        return res.redirect("/changepasscode");
      }
      const isFourDigit = /^\d{4}$/.test(oldpasscode) && /^\d{4}$/.test(newpasscode) && /^\d{4}$/.test(confirmpasscode);
      if (!isFourDigit) {
        req.flash("error", "All passcodes must be exactly 4 digits.");
        return res.redirect("/changepasscode");
      }
      if (newpasscode !== confirmpasscode) {
        req.flash("error", "New passcode and confirmation do not match.");
        return res.redirect("/changepasscode");
      }
      const user = await db.users.findOne({ where: { id: req.session.admin.id } });
      if (!user) {
        req.flash("error", "User not found.");
        return res.redirect("/login");
      }
      if (user.pass_code !== oldpasscode) {
        req.flash("error", "The old passcode is incorrect.");
        return res.redirect("/changepasscode");
      }
      user.pass_code = newpasscode;
      await user.save();
      req.flash("success", "Passcode updated successfully.");
      return res.redirect("/changepasscode");
    } catch (error) {
      console.error("Error updating passcode:", error);
      req.flash("error", "A server error occurred. Please try again later.");
      return res.status(500).redirect("/changepasscode");
    }
  },
  logout: async (req, res) => {
    try {
      req.session.destroy();
      res.redirect("/login");
    } catch (error) {
      return helper.error(res, error);
    }
  },
  user_list: async (req, res) => {
    try {
      if (!req.session.admin) return res.redirect("/login");
      const data = await db.users.findAll({
        where: {
          role: "1",
        },
        raw: true,
      });
      res.render("admin/userlist", {
        title: "Users",
        data,
        session: req.session.admin,
      });
    } catch (error) {
      console.error("Error fetching user list:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  user_status: async (req, res) => {
    try {
      const result = await db.users.update(
        { status: req.body.status },
        { where: { id: req.body.id } }
      );
      if (result[0] === 1) {
        res.json({ success: true });
      } else {
        res.json({ success: false, message: "Status change failed" });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },
  view: async (req, res) => {
    try {
      if (!req.session.admin) return res.redirect("/login");

      let view = await db.users.findOne({

        where: {
          id: req.params.id,

        },
      });
      res.render("admin/view.ejs", {
        session: req.session.admin,
        view,
        title: 'User Detail',
      });
    } catch (error) {
      console.error("Error fetching view", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  user_delete: async (req, res) => {
    try {
      const userId = req.params.id;
      if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
      }
      const user = await db.users.findByPk(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      await db.users.destroy({ where: { id: userId } });

      res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },
}
