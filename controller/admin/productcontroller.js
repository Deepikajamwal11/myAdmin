const helper = require('../../helper/helper');
const db = require('../../models');
const { Validator } = require('node-input-validator');
db.products.belongsTo(db.category, {
    foreignKey: "cat_id",
    as: "cate",
});


module.exports = {
    createproduct: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                cat_id: "required",
                product_name: "required",
                // price: 'string|required',
                // image: "string|required", 
            });
            let errorsResponse = await helper.checkValidation(v);
            if (errorsResponse) {
                return helper.error(res, errorsResponse);
            }
            if (req.files && req.files.image) {
                let images = await helper.fileUpload(req.files.image);
                req.body.image = images;
            }
            const products = await db.products.create({
                product_name: req.body.product_name,
                price: req.body.price,
                image: req.body.image,
                kilogram: req.body.kilogram,
                cat_id: req.body.cat_id,
                description: req.body.description
            });
            req.flash("success", "Add products successfully");
            res.redirect('/productlist');

        } catch (error) {
            console.error("Error creating products:", error);
            return helper.error(res, "Internal server error");
        }
    },
    getproduct: async (req, res) => {
        try {
            if (!req.session.admin) return res.redirect("/login");
            const data = await db.products.findAll({
                include: [{ model: db.category, as: 'cate' }],

            });
            console.log(data, '/////////////');
            res.render("products/productlist.ejs", {
                title: "Products",
                data,
                session: req.session.admin,
            });


        } catch (error) {
            console.error("Error view:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
    status: async (req, res) => {
        try {
            const result = await db.products.update(
                { status: req.body.status },
                { where: { id: req.body.id } }
            );
            if (result[0] === 1) {
                res.json({ success: true });
            } else {
                res.json({ success: false, message: "status change failed" });
            }

        } catch (error) {
            console.error("Error Updating status:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
    delete: async (req, res) => {
        try {
            if (!req.params.id) {
                return res.status(400).json({ success: false, message: "product ID is required" });
            }
            const service = await db.products.findByPk(req.params.id);
            if (!service) {
                return res.status(404).json({ success: false, message: "products not found" });
            }
            await db.products.destroy({ where: { id: req.params.id } });

            return res.json({ success: true, message: "products deleted successfully" });
        } catch (error) {
            console.error("Error deleting products:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
    productview: async (req, res) => {
        try {
            if (!req.session.admin) return res.redirect("/login");

            const data = await db.products.findOne({
                include: [
                    { model: db.category, as: 'cate' },

                ],
                where: { id: req.params.id }
            });

            res.render("products/productview", {
                title: "Product Detail",
                data,
                session: req.session.admin,
            });
        } catch (error) {
            console.error("Error in product view", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
    productadd: async (req, res) => {
        try {
            if (!req.session.admin) return res.redirect("/login");

            const data = await db.category.findAll({
                where: { status: 1 },
                raw: true
            });

            res.render('products/productadd', {
                session: req.session.admin,
                title: "Add product",
                data
            });
        } catch (error) {
            console.error("Error view", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
    producteditview: async (req, res) => {
        try {
            if (!req.session.admin) return res.redirect("/login");

            const data = await db.products.findOne({
                include: [{ model: db.category, as: 'cate' }],
                where: { id: req.params.id }
            });

            const categories = await db.category.findAll({
                where: { status: 1 },
                raw: true
            });

            res.render('products/productedit', {
                session: req.session.admin,
                title: "Edit Product",
                data,
                categories
            });
        } catch (error) {
            console.error("Error view", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
    productedit: async (req, res) => {
        try {

            if (!req.session.admin) return res.redirect("/login");
            const v = new Validator(req.body, {
                cat_id: "required",
                product_name: "required",
                price: 'string|required',
                image: "string",
            });

            let errorsResponse = await helper.checkValidation(v);
            if (errorsResponse) {
                return helper.error(res, errorsResponse);
            }
            if (!req.params.id) {
                return res.status(400).json({ success: false, message: "Product ID is required" });
            }
            const product = await db.products.findByPk(req.params.id);
            if (!product) {
                return res.status(404).json({ success: false, message: "Product not found" });
            }
            if (req.files && req.files.image) {
                let images = await helper.fileUpload(req.files.image);
                req.body.image = images;
            } else {
                req.body.image = product.image;
            }
            await db.products.update({
                product_name: req.body.product_name,
                price: req.body.price,
                image: req.body.image,
                kilogram: req.body.kilogram,
                cat_id: req.body.cat_id
            }, {
                where: { id: req.params.id }
            });

            req.flash("success", "Product updated successfully");
            res.redirect('/productlist');
        } catch (error) {
            console.error("Error updating product:", error);
            return helper.error(res, "Internal server error");
        }
    },
}