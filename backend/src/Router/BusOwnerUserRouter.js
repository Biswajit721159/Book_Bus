let Router = require("express");
const router = Router();

let { login, register } = require('../Controler/BusOwnerUsercontrolter')
let { getBusById, getBuses, AddBusInBusOwnerDataBase } = require('../Controler/BusOwnerDatabasecontroler');
let { getBookingDatabyDate } = require('../Controler/bookingcontroler')
const verifytoken = require("../Middelware/TokenVerification");

router.route('/login').post(login);
router.route('/register').post(register);
router.route('/getBusById/:id').get(getBusById);
router.route('/getBuses').get(verifytoken,getBuses);
router.route('/addBus').post(AddBusInBusOwnerDataBase);
router.route('/getBookingStatus').patch(getBookingDatabyDate);



module.exports = router;