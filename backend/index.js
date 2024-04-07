let express = require("express");
let cors = require("cors");
let app = express();

app.use(express.json({ limit: "50mb" }));
const dotenv = require('dotenv')
dotenv.config();

let connectDB = require("./src/DbConnection/connection");
app.use(cors());
app.use(cors({
  origin: '*',
  methods: 'GET, POST, PUT, DELETE, PATCH',
  allowedHeaders: 'Content-Type',
}));

app.use(express.static("public"))
const ObjectID = require('mongodb').ObjectId;

connectDB()

let Jwt = require("jsonwebtoken");
const jwtKey = "Bookbus";


let deconnect_bus_detail = require('./Busadder')
let dbconnect_Booking = require('./booking')
let dbconnect_BusOwner = require('./BusOwner')
let BusOwner_dataBase = require('./BusOwner_dataBase')
let dbconnect_Adminpanel_user = require('./dbconnect_Adminpanel_user')
let dbconnect_sendMessage = require('./sendMessage')

let mainRouter = require('./src/Router/mainRouter')
let bcrypt = require("bcrypt")


app.use('/api', mainRouter)
//adminpanel

app.put('/updatebusdetail', verifytoken, async (req, resp) => {
  let data = await BusOwner_dataBase()
  try {
    let result = await data.updateOne(
      { _id: new ObjectID(req.body.data._id) },
      { $set: { status: req.body.status } }
    );
    if (result.acknowledged && req.body.status == 'approved') {
      delete req.body.data.status
      let data = await deconnect_bus_detail()
      let result = await data.insertOne(req.body.data);
    }
    else if (result.acknowledged) {
      resp.send({ 'status': 200, 'message': "Added SuccessFully" });
    }
    else {
      resp.send({ 'status': 498, 'message': "We Find Some Error" });
    }
  }
  catch {
    console.log("Error");
  }
})

app.patch('/adminpanel/login', async (req, resp) => {
  if (req.body.email && req.body.password) {
    let data = await dbconnect_Adminpanel_user();
    let password = req.body.password

    let user = await data.findOne({
      email: req.body.email
    });
    if (user == null) resp.send("user no found");
    else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch == false) {
        resp.send("user no found");
      }
      delete user.password
      if (user) {
        Jwt.sign({ user }, jwtKey, (error, token) => {
          if (error) {
            resp.send({ message: "We find some error" });
          }
          resp.send({ user, auth: token });
        });
      } else {
        resp.send("user no found");
      }
    }
  }
  else {
    resp.send("user not found");
  }
})

app.get('/adminpanel/getdata', verifytoken, async (req, resp) => {
  let data = await BusOwner_dataBase();
  let result = await data.find({}).toArray()
  let ans = []
  for (let i = 0; i < result.length; i++) {
    if (result[i].status == 'pending') {
      ans.push(result[i])
    }
  }
  for (let i = 0; i < result.length; i++) {
    if (result[i].status != 'pending') {
      ans.push(result[i])
    }
  }
  resp.send(result)
})

app.post('/adminpanel/register', async (req, resp) => {
  // let  name=req.body.name;
  // let email=req.body.email;
  // let password=req.body.password;

  // const salt = await bcrypt.genSalt();
  // const passwordHash = await bcrypt.hash(password, salt);

  // let data = await dbconnect_Adminpanel_user();
  // let res=await data.find({email:email}).toArray()

  // if(res.length!=0)
  // {
  //      resp.send({'status':498,'message':"This Email is Already used"})
  // }
  // else
  // {
  //     let result = await data.insertOne({
  //       name:name,
  //       email:email,
  //       password:passwordHash
  //     });
  //     delete req.body.password
  //     let user=req.body

  //     if (result.acknowledged) 
  //     {
  //         Jwt.sign({ user }, jwtKey, (error, token) => {
  //             if (error) 
  //             {
  //                resp.send({'status':498, 'message': "We find some error" });
  //             }
  //             resp.send({ 'status':200, user, auth: token });
  //         });
  //     } 
  //     else 
  //     {
  //         resp.send({'status':498, 'message': "We find some error" });
  //     }
  // }

})

//bus Owner section ---


app.get('/busownerGetById/:_id', async (req, resp) => {
  let data = await BusOwner_dataBase()
  let result = await data.find({ '_id': new ObjectID(req.params._id) }).toArray()
  resp.send(result)
})

app.get('/busowner/:email', verifytoken, async (req, resp) => {
  let data = await BusOwner_dataBase()
  let result = await data.find({ email: req.params.email }).toArray()
  resp.send(result)
})

app.patch('/busowner/getBookingStatus', verifytoken, async (req, resp) => {
  let date = req.body.date;
  let bus_id = req.body.bus_id;
  let data = await dbconnect_Booking();
  let result = await data.find({ bus_id: bus_id, date: date }).toArray();
  let ans = []
  for (let i = 0; i < result.length; i++) {
    for (let j = 0; j < result[i].person.length; j++) {
      let obj = {
        "src": result[i].src,
        "dist": result[i].dist,
        "Pay": result[i].total_money / result[i].person.length,
        "name": result[i].person[j],
        "seat_no": result[i].seat_record[j],
        "total_distance": result[i].total_distance,
        "PNR_No": result[i]._id,
      }
      ans.push(obj)
    }
  }

  ans.sort((a, b) => {
    let fa = (a.seat_no)
    let fb = (b.seat_no)

    if (fa < fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  });

  resp.send(ans)
})

app.post('/busowner/addBus', async (req, resp) => {
  let data = await BusOwner_dataBase()
  let result = await data.insertOne(req.body);
  if (result.acknowledged == true) {
    resp.send({ 'status': 200, 'message': "added SuccessFully" });
  }
  else {
    resp.send({ 'status': 498, 'message': "Invalid Detail" });
  }
})

app.patch('/busowner/login', async (req, resp) => {

  if (req.body.email && req.body.password) {
    console.log(req.body);
    let data = await dbconnect_BusOwner();
    let password = req.body.password
    console.log(password)

    let user = await data.findOne({ email: req.body.email });
    console.log("user", user);
    if (user == null) resp.send({ 'status': 498, 'message': "Invalid User" })
    else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch == false) {
        resp.send({ 'status': 498, 'message': "Sorry Invalid User!" })
      }
      delete user.password
      if (user) {
        Jwt.sign({ user }, jwtKey, (error, token) => {
          if (error) {
            resp.send({ 'status': 498, 'message': "Invalid User" })
          }
          resp.send({ user, auth: token });
        });
      }
      else {
        resp.send({ 'status': 498, 'message': "Invalid User" })
      }
    }
  }
  else {
    resp.send({ 'status': 498, 'message': "Invalid User" })
  }
})

app.post('/busowner/register', async (req, resp) => {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;

  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  let data = await dbconnect_BusOwner();
  let res = await data.find({ email: email }).toArray()

  if (res.length != 0) {
    resp.send({ 'status': 498, 'message': "This Email is Already used" })
  }
  else {
    let result = await data.insertOne({
      name: name,
      email: email,
      password: passwordHash
    });
    delete req.body.password
    let user = req.body

    if (result.acknowledged) {
      Jwt.sign({ user }, jwtKey, (error, token) => {
        if (error) {
          resp.send({ 'status': 498, 'message': "We find some error" });
        }
        resp.send({ 'status': 200, user, auth: token });
      });
    }
    else {
      resp.send({ 'status': 498, 'message': "We find some error" });
    }
  }
})


app.post('/sendMessage', verifytoken, async (req, resp) => {
  let data = await dbconnect_sendMessage();
  let result = await data.insertOne(req.body)
  if (result.acknowledged == true) {
    return resp.send({ 'status': 200 });
  }
  else {
    return resp.send({ 'status': 498 })
  }
})

//normals
function verifytoken(req, res, next) {
  let token = req.headers["auth"];
  if (token) {
    token = token.split(" ")[1];
    Jwt.verify(token, jwtKey, (error, valid) => {
      if (error) {
        res.status(401).send({ status: "498", mess: "Invalid Token" });
      }
      else if (valid.user.email && valid.user._id && valid.user.name) {
        next();
      }
      else {
        res.status(401).send({ status: "498", mess: "Invalid Token" });
      }
    });
  } else {
    res.status(498).send({ status: 498, mess: "Invalid Token" });
  }
}

app.listen(5000);
