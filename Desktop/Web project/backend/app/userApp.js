//app.js acts as the traffic controller, directing requests and responses.
//userController.js handles the actual user management logic and interacts with the data source.
//express call krnn mulin
const express = require('express');

//instance ekk hadagnnnw app kyl express wlin
const app= express();

//import cors(cross origin resource sharing)
const cors = require('cors');

//me ara file ekk import krnne
const userController = require('../controllers/userController');

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
app.get('/users',(req,res)=>{
  //req,res,next kynne getuser function eke tyna parameters(controller.js eke)
  userController.getUsers(req,res,next=> {
      //yata eke return krnw response ek
      res.send();

     });
   });
//update eke em method ek oni nm put daannath puluwn. delete user eke method ek delete daanna. ehemne API wl wenne 



//post method eken user kenk hadiim. uda kle user kenek search krl gnna ekne
  app.post('/createuser',(req,res)=>{
    
    userController.addUser(req.body,(calLack) => {
        res.send();

        //uda callback ekk pass krl tynne..req.body eken dena ek ara anith page eke tyna function ek mgin userw save krgnnw
      });

    });




    //update user ek. ekth post method ekkmi

  app.put('/updateuser',(req,res)=>{
    
    userController.updateUser(req.body,(calLack) => {
        res.send(calLack);
        //methanadi call back unu ek retern krgnna oni. hriyt update und balagnn oni nisa

      });

    });


    app.delete('/deleteuser',(req,res)=>{
    
        //uda pennl tynne path ek.yata deleteuser kynne finction ek
      //meketh req,res,next kynne adduser function eke tyna parameters(controller.js eke)
      userController.deleteUser(req.body,(calLack) => {
       res.send(calLack);
       //methanadi call back unu ek retern krgnnaw . dele une mona userd balagnna

     });

   }
  );








//me yata ew ara DB hdnn klin Manually array wlin dta arn penna nna hdpu ew
// rest API (get api dekk me yata)
//parametr thunai. url ekai request ekai,response ekai
// app.get('/users',(req,res)=>{
//   controller.getUsers(users => {
//     res.send(users);
//   });
// });
//uda res.send(users) kynnne respond ek wifiht return kiriima en users list ek. controller.getUser kynne ara import krpu file eken ena function
//browser eke http://localhost:3001/users ghl blnna

//dan ek API ekk hri. localhost:3001/users kyl ghuwm e list ek return krnn oni
//dan ilaga API ek
//mekth ain kla DB hduwt psu
// app.get('/user',(req,res)=>{
// // meke id ek passs krnn oni. query parameter ekk widiht
//   const id = req.query.id;
//   controller.getUserById(id,user => {
//     res.send(user);
//   });
//   //uda id and call back dekma pass krnn oni. userwa send krl daanw
// });

//localhost:3001/user?id=1  uda API ekenn output gnnna nm me widiht ghnna browser eke. query parameter ek ? mark ekt pasuwa denna oni.localhost:3001/user?id=1& & dila multiple query dennth puluwn

//dan me app ek(module ek)export krgmu server.js eken access krnn puluwn wenna.meka hdl tynne express wlin



module.exports=app;
