const helper = require('../../helper/helper');
const db = require('../../models');
const { Validator } = require('node-input-validator');
db.booking.belongsTo(db.users, {
    foreignKey: "user_id",
    as: "data"
});
db.booking.belongsTo(db.category, {
    foreignKey: "cat_id",
    as: "categories"
});
db.booking.belongsTo(db.products, {
    foreignKey: "product_id",
    as: "product"
});

module.exports = {
    createBooking: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                product_id: "required",
                user_id: "required",
                cat_id: "required",

            });

            const errorsResponse = await helper.checkValidation(v);
            if (errorsResponse) {
                return helper.error(res, errorsResponse);
            }
            const booking = await db.booking.create({
                product_id: req.body.product_id,
                user_id: req.body.user_id,
                cat_id: req.body.cat_id,
                no_of_booking: req.body.no_of_booking,
                description: req.body.description,
                location: req.body.location,
                price: req.body.price
            });

            return res.status(201).json({ message: 'Booking created successfully', booking });
        } catch (error) {
            console.error("Error creating booking:", error);
            return helper.error(res, "Internal server error");
        }
    },
    getBooking: async (req, res) => {
        try {
            if (!req.session.admin) return res.redirect("/login");
            let data = await db.booking.findAll({
                include: [
                    { model: db.users, as: 'data' },
                    { model: db.category, as: 'categories' },
                    { model: db.products, as: 'product' }
                ], raw: true, nest: true

            });

            res.render("booking/bookinglist.ejs", {
                title: "Bookings",
                data,
                session: req.session.admin,
            });
        } catch (error) {
            console.log(error);
            return helper.error(res, "Internal server error", error);

        }
    },
    bookingstatus: async (req, res) => {
        try {
            const { id, status } = req.body;
            if (!["0", "1", "2"].includes(status)) {
                return res.status(400).json({ message: "Invalid status value" });
            }
            const [updatedCount, updatedBooking] = await db.booking.update(
                { status },
                {
                    where: { id },
                    returning: true
                }
            );

            if (updatedCount === 0) {
                return res.status(404).json({ message: "Booking not found" });
            }

            return res.status(200).json({
                success: true,
                message: "Booking status updated successfully",
                data: updatedBooking[0]
            });
        } catch (error) {
            console.error("Error updating booking status:", error);
            return res.status(500).json({ message: "An error occurred while updating booking status" });
        }
    },
    deletebooking: async (req, res) => {
        try {
            if (!req.params.id) {
                return res.status(400).json({ success: false, message: "booking ID is required" });
            }
            const booking = await db.booking.findByPk(req.params.id);
            if (!booking) {
                return res.status(404).json({ success: false, message: "booking not found" });
            }
            await db.booking.destroy({ where: { id: req.params.id } });
            console.log()

            return res.json({ success: true, message: "booking deleted successfully" });
        } catch (error) {
            console.error("Error deleting booking:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
    bookingview: async (req, res) => {
        try {
            const data = await db.booking.findOne({
                include: [{
                    model: db.users,
                    as: "data"
                },
                { model: db.category, as: 'categories' },
                { model: db.products, as: 'product' }],
                where: { id: req.params.id }
            });

            res.render("booking/bookingview.ejs", {
                title: "Detail",
                data,
                session: req.session.admin,
            });
        } catch (error) {
            console.error("Error view", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
}