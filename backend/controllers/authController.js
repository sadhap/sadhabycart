const catchAsyncError  = require("../middlewares/catchAsyncError");
const User = require("../models/userModel"); 
const sendEmail = require("../utils/email");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwt");
const crypto = require('crypto');

// register user - {{base_url}}/api/v1/register
exports.registerUser = catchAsyncError(async(req,res,next)=>{
 const {name,email,password} = req.body
 let avatar;
 let BASE_URL =process.env.BACKEND_URL;
 if(process.env.NODE_ENV === 'production'){
      BASE_URL = `${req.protocol}://${req.get('host')}`
 }
 if(req.file){
  avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`
 }
 const user = await User.create({
        name,
        email,
        password,
        avatar
     });
     sendToken(user,201,res)

})
//this is register user handler function....................
//creating login API
//loginuser 


// login user  - {{base_url}}/api/v1/login
exports.loginUser = catchAsyncError(async (req,res,next)=>{
    const {email,password} = req.body
    if(!email || !password) {
        return next(new ErrorHandler('please enter email and password',400))
    }
    //finding user database
  const user = await User.findOne({email}).select('+password');
  if(!user){
    return next(new ErrorHandler('invalid email or dsd password',401));
  }
  //checking password
if(!await user.isValidPassword(password)){
    return next(new ErrorHandler('invalid email or password',401))
}
//cprrect data recived
sendToken(user,201,res)

});

// logOut user-{{base_url}}/api/v1/logout
exports.logoutUser = (req, res, next) => {
  res.cookie('token',null, {
      expires: new Date(Date.now()),
      httpOnly: true
  })
  .status(200)
  .json({
      success: true,
      message: "Loggedout"
  })

}

//forgot-Password --- {{base_url}}/api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async(req,res,next)=>{
  const user = await User.findOne({email:req.body.email})
  if(!user){
    return next(new ErrorHandler('user not found with this email....'),404);
  }
  const resetToken = user.getResetToken(); 
   await user.save({validateBeforeSave:false})

   let BASE_URL =process.env.FRONTEND_URL;
 if(process.env.NODE_ENV === 'production'){
      BASE_URL = `${req.protocol}://${req.get('host')}`
 }
  //create url....reset url
  const resetUrl= `${BASE_URL}/password/reset/${resetToken}`;
  console.log(resetUrl);
  const message = `Your password reset token url is as follows \n\n
  ${resetUrl}\n\n if you not request this email,then ignore it please!`;
  try{
//create utiliti functionmongodb://localhost:27017
sendEmail({
  email:user.email,
  subject:'sadhadevelopershop password recovery',
  message
})
res.status(200).json({    
  success:true,
  message:`email send to ${user.email}`
})
  }catch(error){
   user.resetPasswordToken = undefined;
   user.resetPasswordTokenExpire = undefined;
   await user.save({validateBeforeSave:false})
   return next(new ErrorHandler(error.message),500)
  }
})

//reset password----{{base_url}}/api/v1/password/reset/:token
exports.resetPassword = catchAsyncError(async (req,res,next)=>{
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({resetPasswordToken,
  resetPasswordTokenExpire:{
    $gt:Date.now()
  }
  })

  if(!user){
    return next(new ErrorHandler('password reset token is invalid or expired'))
  }
  if(req.body.password !== req.body.confirmPassword){
    return next(new ErrorHandler('password dose not match'))
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpire = undefined;
  await user.save({validateBeforeSave:false})
  sendToken(user,201,res)
})

//get user profile --{{base_url}}/api/v1/myProfile
exports.getUserProfile = catchAsyncError(async(req,res,next)=>{
  const user = await User.findById(req.user.id)
  res.status(200).json({
    success:true,
    user
  })
})


//change passWord ----{{base_url}}/api/v1/password/change
exports.changePassword =   catchAsyncError(async(req,res,next)=>{
  const user = await User.findById(req.user.id).select('+password');
  //check old passWord

  if(!await user.isValidPassword(req.body.oldPassword)){
    return next(new ErrorHandler('old password is incorrect',401))
  }
 //assigning new password 
 user.password = req.body.password;
 await user.save();
 res.status(200).json({
  success:true,
})
})

//update profile----{{base_url}}/api/v1/update

exports.updateProfile = catchAsyncError(async(req,res,next)=>{
let newUserData  = {
  name:req.body.name,
  email:req.body.email
}
let avatar;
let BASE_URL =process.env.BACKEND_URL;
if(process.env.NODE_ENV === 'production'){
     BASE_URL = `${req.protocol}://${req.get('host')}`
}
if(req.file){
 avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`
 newUserData= {...newUserData,avatar}
}
const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
  new:true,
  runValidators:true,
})
res.status(200).json({
  success:true,
  user
})
})

//Admin:Get all users .....{{base_url}}/api/v1/admin/users
exports.getAllUsers = catchAsyncError(async(req,res,next)=>{
const users = await User.find();
res.status(200).json({
  success:true,
  users
})
})

//Admin:get specifig user .....{{base_url}}/api/v1/admin/user/64996e0fe7bd16df7136f46e :id
exports.getUser = catchAsyncError(async(req,res,next)=>{

  const user = await User.findById(req.params.id);
  if(!user){
    return next(new ErrorHandler(`user not found with this id${req.params.id}`))
  }
  res.status(200).json({
    success:true,
    user
  })
})

//Admin:Update user ....{{base_url}}/api/v1/admin/user/64996e0fe7bd16df7136f46e

exports.updateUser =  catchAsyncError(async(req,res,next)=>{
  const newUserData  = {
    name:req.body.name,
    email:req.body.email,
    role:req.body.role
  }
  const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
    new:true,
    runValidators:true,
  })
  res.status(200).json({
    success:true,
    user
  })
})

//deleteUser.......{{base_url}}/api/v1/admin/user/64996e0fe7bd16df7136f46e
exports.deleteUser = catchAsyncError(async(req,res,next)=>{
  const user = await User.findById(req.params.id);
  if(!user){
    return next(new ErrorHandler(`user not found with this id${req.params.id}`))
  }
  await user.deleteOne();
  res.status(200).json({
    success:true,
  })
})