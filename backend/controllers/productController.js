const Product = require('../models/productModel');
const  ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middlewares/catchAsyncError');
const  APIfeatures = require('../utils/apiFeatures')

//get product - {{base_url}}/api/v1/products  url
exports.getProducts = catchAsyncError( async (req,res,next)=>{
  const resPerPage = 5;
  // const apiFeatures = new  APIfeatures(Product.find(),req.query).search().filter().paginate(resPerPage);
  let buildQuery = ()=> {
    return new  APIfeatures(Product.find(),req.query).search().filter()
  }
  const filteredProductCount = await buildQuery().query.countDocuments({})
  const totalProductsCount = await Product.countDocuments({});  
  let productsCount = totalProductsCount;
if(filteredProductCount !== totalProductsCount){
  productsCount = filteredProductCount;
}
const products = await buildQuery().paginate(resPerPage).query;
// console.log(productsCount)

// return  next(new ErrorHandler('Unable to send product ',400))
// await new Promise(resolve => setTimeout(resolve,2000))
res.status(200).json({
    success:true,
    count:productsCount,
    resPerPage,
    products
  })
})
//create product = /api/v1/product/new
exports.newProduct = catchAsyncError( async (req,res,next)=>{

  let images = [];
  let BASE_URL =process.env.BACKEND_URL;
 if(process.env.NODE_ENV === 'production'){
      BASE_URL = `${req.protocol}://${req.get('host')}`
 }
  if(req.files.length>0){
    req.files.forEach(file=>{
      let url = `${BASE_URL}/uploads/product/${file.originalname}`
      images.push({image:url})
    })
  }
  req.body.images = images;
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
 res.status(201).json({
    success:true,
    product
 })
});

//Get-single product
 exports.getSingleProduct =catchAsyncError(async (req,res,next)=>{
  const product = await Product.findById(req.params.id).populate('reviews.user','name email');
  // await new Promise(resolve => setTimeout(resolve,2000));
  if(!product){
  return next( new ErrorHandler("product not fount",400));
  }
  res.status(201).json({
    success:true,
    product
  })
 })
 
 //update products
  exports.updateProducts =catchAsyncError( async (req,res,next)=>{
   let product =  await Product.findById(req.params.id)
   //upload images
   let images = [];
   if(req.body.imagesCleared === 'false'){
    images = product.images;
   }
   let BASE_URL =process.env.BACKEND_URL;
   if(process.env.NODE_ENV === 'production'){
        BASE_URL = `${req.protocol}://${req.get('host')}`
   }
   if(req.files.length>0){
     req.files.forEach(file=>{
       let url = `${BASE_URL}/uploads/product/${file.originalname}`
       images.push({image:url})
     })
   }
   req.body.images = images;
   if(!product){
    return res.status(404).json({
         success:false,
         message:"product not fount"
     });
   }
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
     new:true,
     runValidators:true
   })
  res.status(200).json({
    success:true,
    product
  })
})

//delete product ....> api/v1/product/:id

exports.deleteProduct = catchAsyncError(async(req,res,next)=>{
  let product =  await Product.findById(req.params.id)
  if(!product){
   return res.status(404).json({
        success:false,
        message:"product not fount"
    });
  }
  await product.deleteOne()
  res.status(200).json({
     success:true,
     message:'product deleted'

     
  })
})

//create-review -----api/v1/review

exports.createReview  = catchAsyncError(async(req,res,next)=>{
const {productId,rating,comment}= req.body;
const review ={
  user:req.user.id,
  rating,
  comment
}
const product = await Product.findById(productId);
//finding user review exist
 const isReviewed = product.reviews.find(review=>{
  return review.user.toString() == req.user.id.toString();
})
if(isReviewed){
  //updating the review
product.reviews.forEach(review =>{
  if(review.user.toString() == req.user.id.toString()) {
    review.comment = comment;
    review.rating = rating
  }
})
}else{
  //creating the review
  product.reviews.push(review)
  product.numOfReviews = product.reviews.length;
}
//findimg average of the product reviews
product.ratings= product.reviews.reduce((acc,review)=>{
  return review.rating + acc; //aclemate value

},0) / product.reviews.length;
product.ratings = isNaN(product.ratings)?0:product.ratings;
await product.save({validateBeforeSave:false});
res.status(200).json({
  success:true
})
})

//Get reviews -- api/v1/reviews?id={productId} --using query 
exports.getReviews = catchAsyncError(async(req,res,next)=>{
  const product = await Product.findById(req.query.id).populate('reviews.user','name email');;
  res.status(200).json({
    success:true,
    reviews:product.reviews
  })
})

//Delete review -- api/v1/review

//Get reviews -- api/v1/reviews?id={productId} --using query 
exports.deleteReview= catchAsyncError(async(req,res,next)=>{
  const product = await Product.findById(req.query.productId);
  //filtering the reviews which does not match the deleting id
  const reviews = product.reviews.filter(review=>{
    return review._id.toString() !==req.query.id.toString();
  });
  //update the num of reviews
  const numOfReviews = reviews.length;
  //finding the average reviews
let ratings = reviews.reduce((acc,review)=>{
  return review.rating + acc; //aclemate value

},0) /reviews.length;
ratings = isNaN(ratings)?0:ratings;

//saving the product document
await Product.findByIdAndUpdate(req.query.productId,{
  reviews,numOfReviews,ratings
})
res.status(200).json({
  success:true
})
});

// get admin products  - api/v1/admin/products
exports.getAdminProducts = catchAsyncError(async (req, res, next) =>{
  const products = await Product.find();
  res.status(200).send({
      success: true,
      products
  })
});