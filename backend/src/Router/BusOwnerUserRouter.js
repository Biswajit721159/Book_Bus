let Router = require("express");
const router = Router();

let { login, register } = require('../Controler/BusOwnerUsercontrolter')
let { getBusById, getBusByEmail, AddBusInBusOwnerDataBase } = require('../Controler/BusOwnerDatabasecontroler');
let { getBookingDatabyDate } = require('../Controler/bookingcontroler')
const verifytoken = require("../Middelware/TokenVerification");

router.route('/login').post(login);
router.route('/register').post(register);
router.route('/getBusById/:id').get(getBusById);
router.route('/getBusByEmail/:email').get(getBusByEmail);
router.route('/addBus').post(AddBusInBusOwnerDataBase);
router.route('/getBookingStatus').patch(getBookingDatabyDate);



module.exports = router;