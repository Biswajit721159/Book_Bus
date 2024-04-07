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

let mainRouter = require('./src/Router/mainRouter')

app.get('/', async (req, res) => {
  res.send("Server is Running clearly")
})

app.use('/api', mainRouter)


app.listen(5000);
