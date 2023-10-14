const catchAsyncError = require("../middlewares/catchAsyncError");
//create new order  ---- api/v1/order/new
const Order = require("../models/orderModel");
const ErrorHandler = require("../utils/errorHandler");
const Product = require('../models/productModel');

exports.newOrder = catchAsyncError(async(req,res,next)=>{
    const {
        orderItems,
        shippingInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    }=req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt:Date.now(),
        user:req.user.id
    })
    res.status(200).json({
        success:true,
        order
    })

})

//get single order ----api/v1/order/new/:id
exports.getSingleOrder = catchAsyncError(async(req,res,next)=>{
const order =await Order.findById(req.params.id).populate('user','name email');
if(!order){
    return next(new ErrorHandler(`order not found with this id${req.params.id}`,404));
}
res.status(200).json({
    success:true,
    order
})
})

//get logged in user orders -----
exports.myOrders= catchAsyncError(async(req,res,next)=>{
    const orders=await Order.find({user:req.user.id});
   
    res.status(200).json({
        success:true,
        orders
    })
    })

///admin:get all orders---- api/v1/orders

exports.orders= catchAsyncError(async(req,res,next)=>{
    const orders=await Order.find();
    let totalAmount = 0;
    orders.forEach(order =>{
        totalAmount += order.totalPrice
    })
    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
    })

    //update order/order status  ----api/v1/order/:i
    exports.updateOrders= catchAsyncError(async(req,res,next)=>{
    const order =await Order.findById(req.params.id)
        if(order.orderStatus == 'Delivered'){
            return next(new ErrorHandler("Order has been already  delivered "))
        }
        //updating the product stock  of each item
        order.orderItems.forEach(async orderItem => {
            await updateStock(orderItem.product,orderItem.quantity)
        })
   order.orderStatus = req.body.orderStatus;
   order.deliveredAt = Date.now();
   await order.save();
   res.status(200).json({
    success:true
   });

       
    });
    async function updateStock(productId,quantity){
   const product = await Product.findById(productId);
        // console.log(product);
        product.stock = product.stock - quantity;
        product.save({validateBeforeSave:false});
    };


//Delete order ------api/v1/order/:id


exports.deleteOrder  = catchAsyncError(async(req,res,next)=>{
    const order =await Order.findById(req.params.id)
    if(!order){
        return next(new ErrorHandler(`order not found with this id${req.params.id}`,404));
    }
await order.deleteOne();
res.status(200).json({
    success:true
})
})