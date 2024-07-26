
const express = require('express');
const app= express();
const cors = require('cors');

require('dotenv').config();

//node ek run krnn server ekk hdmu.express applicatio ekt listen krnn kyl command ekk.host eki port eki mentio krnna.local host eke ip ek dunne
//call back function ekk denw ilaga parameter ek widiht. server ek run wenwd balagnn ek methna nm dunne
const port =3002;
const host='localhost';


const mongoose=require('mongoose');
//routse tika import
// Routes
const userRouter = require('./routes/userRoutes'); // user routes file
const driverRouter = require('./routes/driverRoutes'); //  driver routes file
const travellerListeningrouter = require('./routes/travellerListeningRoutes'); //traveller listenijng routes file
const hireRouter = require('./routes/hireRoutes'); 

const adminRouter = require('./routes/adminRoutes');

const bookingRouter = require('./routes/bookingRoutes');

//midlware tikath daagmu app.js eke tibba
app.use(cors());
app.use(express.json());

//mongodb URI ek mention krgmu string ekk widiht
//meth pwd hriyt danna nthnm en nh
const uri='mongodb+srv://lakshanravindu375:abcABC123@cluster0.2gmbcq1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const connect = async () => {
    try{
            await mongoose.connect(uri); //mongoose hraha connect wenw uri ekt
            console.log('connected to MongoDB'); //hriyt connect und blaagnna meka denne
    }
    catch(error){
        //error ekk awoth mokd wenne kyl mekt denne
        console.log('MongoDB error:', error);


    }
};

//without connect();, the connect() function won't execute, and the code inside it won't run. 

connect(); //uda function ek call kiriima

//meka nm server ek hdn ek
const server=app.listen(port,host,()=>{
    console.log(`Node server is listening to ${server.address().port}`)
});

//server ek run wenw nm run wena server eke port ek arn penwi.methna port kynne uda variable ek newe
//run wenw nm me msg ek penwai Node server is listening to ${server.address().po


//API url ekk kyl specify krnn hamawitm api kyl wdinw yt ek dunnt psu(doamain/api/...)
app.use('/api/users', userRouter);
app.use('/api/drivers', driverRouter);
app.use('/api/travellistening', travellerListeningrouter);
app.use('/api/hire',hireRouter );
app.use('/api/admins', adminRouter);
app.use('/api/booking', bookingRouter);
