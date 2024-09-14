let Router = require("express");
const router = Router();

let { login, register } = require('../Controler/BusOwnerUsercontrolter')
let { getBusById, getBuses, AddBusInBusOwnerDataBase, findBussByFilter, getBussByEmail } = require('../Controler/BusOwnerDatabasecontroler');
let { getBookingDatabyDate } = require('../Controler/bookingcontroler')
const verifytoken = require("../Middelware/TokenVerification");

router.route('/login').post(login);
router.route('/register').post(register);
router.route('/getBusById/:id').get(getBusById);
router.route('/getBuses').get(verifytoken, getBuses);
router.route('/addBus').post(AddBusInBusOwnerDataBase);
router.route('/getBookingStatus').patch(verifytoken, getBookingDatabyDate);
router.route('/findBussByFilter').post(verifytoken, findBussByFilter);
router.route('/getBussByEmail').get(verifytoken, getBussByEmail);



module.exports = router;