let Router = require("express");
const router = Router();
let { getBusById, getBuses, AddBusInBusOwnerDataBase, findBussByFilter, getBussByEmail, editBus } = require('../Controler/BusOwnerDatabasecontroler');
let { getBookingDatabyDate } = require('../Controler/bookingcontroler')
const verifytoken = require("../Middelware/TokenVerification");
const { editBusValidation, addBusValidation } = require("../helpers/busDataValidation");

router.route('/getBusById/:id').get(getBusById);
router.route('/getBuses').get(verifytoken, getBuses);
router.route('/addBus').post(verifytoken, addBusValidation, AddBusInBusOwnerDataBase);
router.route('/getBookingStatus').patch(verifytoken, getBookingDatabyDate);
router.route('/findBussByFilter').post(verifytoken, findBussByFilter);
router.route('/getBussByEmail').get(verifytoken, getBussByEmail);
router.route('/editBus').patch(verifytoken, editBusValidation, editBus);


module.exports = router;