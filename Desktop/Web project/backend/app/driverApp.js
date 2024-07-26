//app.js acts as the traffic controller, directing requests and responses.
//userController.js handles the actual user management logic and interacts with the data source.
//express call krnn mulin
const express = require('express');

//instance ekk hadagnnnw app kyl express wlin
const app= express();

//import cors(cross origin resource sharing)
const cors = require('cors');

//me ara file ekk import krnne
const driverController = require('../controllers/driverController');

//app.use haraha middlware ekk add krnw cors kyl .API wl request, respond event wlt change ekk krnn tma me middlware oni wenne
app.use(cors());
//yata middlware ek gnne frontend eke idn html widiht wenas widiht hdl ewn input encode krl hri widiht hdl gnn oni wena middlwre ekk.true daanne oni ekk encode krgnna puluwn wenna
app.use(
  express.urlencoded({
    extended:true,
  })
);
//yata middlware eke krnne api request respond wlt ywn data, json format ekt(ekenne transmission krnne) convert krima
app.use(express.json());



//controller eke hdpu ew(function em dan app.js ekt gnn oni rest API hdl)
//me function ma thite controller.js eketh. eken tma aththtm wade krnne. mewagen krnne ekt data pass krn ek wge
//userw gnna ek search krl
app.get('/drivers',(req,res)=>{
  //req,res,next kynne getuser function eke tyna parameters(controller.js eke)
  driverController.getDrivers(req,res,next=> {
      //yata eke return krnw response ek
      res.send();

     });
   });
//update eke em method ek oni nm put daannath puluwn. delete user eke method ek delete daanna. ehemne API wl wenne 



//post method eken user kenk hadiim. uda kle user kenek search krl gnna ekne
  app.post('/createdriver',(req,res)=>{
    
    driverController.addDriver(req.body,(calLack) => {
        res.send();

        //uda callback ekk pass krl tynne..req.body eken dena ek ara anith page eke tyna function ek mgin userw save krgnnw
      });

    });




    //update user ek. ekth post method ekkmi

  app.put('/updatedriver',(req,res)=>{
    
    driverController.updateDriver(req.body,(calLack) => {
        res.send(calLack);
        //methanadi call back unu ek retern krgnna oni. hriyt update und balagnn oni nisa

      });

    });


    app.delete('/deletedriver',(req,res)=>{
    
        //uda pennl tynne path ek.yata deleteuser kynne finction ek
      //meketh req,res,next kynne adduser function eke tyna parameters(controller.js eke)
      driverController.deleteDriver(req.body,(calLack) => {
       res.send(calLack);
       //methanadi call back unu ek retern krgnnaw . dele une mona userd balagnna

     });

   }
  );






module.exports=app;
