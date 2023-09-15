const express=require('express')
const app=express();
const dotenv=require('dotenv').config()
const { PORT} = process.env;
const cors=require('cors')

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors())

// handling uncaughtException  --> anyThing Not defined
process.on("uncaughtException" , (err)=>{
    console.log(`Error is ${err.message}`)
    console.log(`Shutting down the server due to uncaughtException Error `)
    
    process.exit(1)
})

// Route Import
const segmentRoute =require('./routes/segmentRoute')
const shopifyAuthRoute=require("./routes/shopifyAuthRoute")

app.use('/', segmentRoute);
app.use("/", shopifyAuthRoute)

app.get("/")


const server = app.listen(PORT, () => {
    console.log(`connecting to port ${PORT}`)
})


// Unhandled  Promise Rejection ---> mongoDB cluster ERROR
process.on("unhandledRejection" , err => {
    console.log(`Error ${err.message}`)
    console.log(`Shutting down the server due to Unhandled Promise Rejection`)

    server.close(()=>{
        process.exit(1)
    })
})
