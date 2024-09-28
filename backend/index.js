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

let user = require('./src/Router/userRouter')
let MasterList = require('./src/Router/MasterListRouter')
let bus = require('./src/Router/Bus_detailRouter')
let booking = require('./src/Router/BookingRouter')
let businfo = require('./src/Router/BusOwnerUserRouter')
let Adminpanel = require('./src/Router/Adminpanel_userRouter')
let Verification = require('./src/Router/Verification_Router')
let FavouriteJourney = require('./src/Router/FavouriteJourneyRoute')

app.use('/Verification', Verification)
app.use('/user', user)
app.use('/MasterList', MasterList)
app.use('/bus', bus)
app.use('/Booking', booking)
app.use('/businfo', businfo)
app.use('/Adminpanel', Adminpanel)
app.use('/FavouriteJourney', FavouriteJourney)

app.get('/', async (req, res) => {
  res.send("Server is Running clearly")
})


app.listen(5000);
