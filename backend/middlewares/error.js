const ErrorHandler = require("../utils/errorHandler");

module.exports = (err,req,res,next) =>{
    err.statusCode = err.statusCode || 500 ;
    if(process.env.NODE_ENV == 'development'){
        res.status(err.statusCode).json({
            success:false,
            message:err.message,
            stack:err.stack,
            error:err
        })
    }
    if(process.env.NODE_ENV == 'production'){
        let message = err.message;
        // console.log(message)
        let error = new ErrorHandler(message)
        // console.log(error);
        if(err.name == "ValidationError"){
            message = Object.values(err.errors).map(value => value.message),
            // console.log(message);
            error= new ErrorHandler(message)
            err.statusCode = 400;
        }
        if(err.name == 'CastError'){
            message = `Resource not fount: ${err.path}`;
            error= new ErrorHandler(message)
            err.statusCode = 400;
        }
        if(err.code == 11000){
            let message = `Duplicate ${Object.keys(err.keyValue)} error`;
            error= new ErrorHandler(message)
            err.statusCode = 400;
        }
        if(err.name == 'jsonWebTokenError'){
            let message = 'JSON Web Token is invalid .Try again';
            error= new ErrorHandler(message)
            err.statusCode = 400;
        }
        if(err.name == 'TokenExpiredError'){
            let message = 'JSON Web Token is expired.Try again';
            error= new ErrorHandler(message)
            err.statusCode = 400;
        }``
        res.status(err.statusCode).json({
            success:false,
            message:error.message || "internal server error",
        
        });
    }
 
}