let Router = require("express");
const router = Router();
let verifytoken = require('../Middelware/TokenVerification')
let { GetBusDetailById, GetAllStation, GetBusBySrcDist, getFirstTenBus, AddBus } = require('../Controler/busDetailcontrolter')

router.route('/get_station').get(GetAllStation)
router.route('/get_bus').patch(GetBusBySrcDist)
router.route('/getFirstTenBus').get(getFirstTenBus)
router.route('/bus_detail/:_id').get(GetBusDetailById);
router.route('/bus_detail').post(AddBus)

module.exports = router;