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

connectDB()

let verifytoken=require('./src/utils/ApiResponce')
let user = require('./src/Router/userRouter')
let MasterList = require('./src/Router/MasterListRouter')
let bus = require('./src/Router/Bus_detailRouter')
let booking = require('./src/Router/BookingRouter')
let busowner = require('./src/Router/BusOwnerUserRouter')
let Adminpanel = require('./src/Router/Adminpanel_userRouter')
let sendMessage = require('./src/Router/sendMessageRoute')

app.use('/user', user)
app.use('/MasterList', MasterList)
app.use('/bus', bus)
app.use('/Booking', booking)
app.use('/busowner', busowner)
app.use('/Adminpanel', Adminpanel)
app.use('/sendMessage', sendMessage)

app.get('/', async (req, res) => {
  res.send("Server is Running clearly")
})


app.listen(5000);
