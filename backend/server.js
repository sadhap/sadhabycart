const app = require('./app');
const path = require('path');
const connectDatabase = require('./config/database');
// const { ChildProcess } = require('child_process');

connectDatabase();
const server = app.listen(process.env.PORT,()=>{//8000PORT
    console.log(`server listening to the port ${process.env.PORT} in ${process.env.NODE_ENV}`)
})

process.on('unhandledRejection',(err)=>{
    console.log(`Error:${err.message}`);
    console.log('shutting down the server due to unhandled rejection error');
    server.close(()=>{
        process.exit(1)
    })
})

process.on('uncaughtException',(err)=>{
    console.log(`Error:${err.message}`);
    console.log('shutting down the server due to uncaughtException  error');
    server.close(()=>{
        process.exit(1)
    })
})                                                                                                               
// console.log(a);E:\USER FILES DONT DELETE\Downloads


