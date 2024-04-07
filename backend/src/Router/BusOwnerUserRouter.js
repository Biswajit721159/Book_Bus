let Router = require("express");
const router = Router();

let { login, register } = require('../Controler/BusOwnerUsercontrolter')
let { getBusById, getBusByEmail, AddBusInBusOwnerDataBase } = require('../Controler/BusOwnerDatabasecontroler');
let { getBookingDatabyDate } = require('../Controler/bookingcontroler')
const verifytoken = require("../Middelware/TokenVerification");

router.route('/login').post(login);
router.route('/register').post(register);
router.route('/:_id').post(getBusById);
router.route('/:email').post(verifytoken, getBusByEmail);
router.route('/addBus').post(verifytoken, AddBusInBusOwnerDataBase);
router.route('/getBookingStatus').patch(verifytoken, getBookingDatabyDate)



module.exports = router;