const express = require("express");
const { getProducts, newProduct, getSingleProduct, updateProducts, deleteProduct, createReview, getReviews, deleteReview, getAdminProducts } = require("../controllers/productController");
const router = express.Router();
const {isAuthenticateUser, authorizeRoles} = require("../middlewares/authenticate");
const  multer = require('multer');
const path = require('path')

const upload = multer({storage: multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join( __dirname,'..' , 'uploads/product' ) )
    },
    filename: function(req, file, cb ) {
        cb(null, file.originalname)
    }
}) })

router.route('/products').get(getProducts);
// router.route('admin/product/new').post(isAuthenticateUser,authorizeRoles('admin'),newProduct);
router.route('/product/:id')
            .get(getSingleProduct);
        
router.route('/review').put(isAuthenticateUser,createReview);
                      
//admin routes
router.route('/admin/product/new').post(isAuthenticateUser, authorizeRoles('admin'),upload.array('images'),newProduct);
router.route('/admin/products').get(isAuthenticateUser, authorizeRoles('admin'),getAdminProducts);
router.route('/admin/product/:id').delete(isAuthenticateUser, authorizeRoles('admin'),deleteProduct);
router.route('/admin/product/:id').put(isAuthenticateUser, authorizeRoles('admin'),upload.array('images'),updateProducts);
router.route('/admin/reviews').get(getReviews, authorizeRoles('admin'),upload.array('images'));
router.route('/admin/review').delete(deleteReview, authorizeRoles('admin'),upload.array('images'));
router.route('/admin/reviews').get(isAuthenticateUser, authorizeRoles('admin'),getReviews);
router.route('/admin/review').delete(isAuthenticateUser, authorizeRoles('admin'),deleteReview);
module.exports = router;