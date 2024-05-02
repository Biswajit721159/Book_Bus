let Router = require("express");
const router = Router();
let verifytoken = require('../Middelware/TokenVerification')
let { getTicketByidFprAuthenticateUser, getTicketByEmail, GetTicketById, get_Seat, insertBooking, getTicketForUnAuthUser } = require('../Controler/bookingcontroler')

router.route('/getTicketByidFprAuthenticateUser/:id').get(verifytoken, getTicketByidFprAuthenticateUser);
router.route('/getTicketByid/:id').get(GetTicketById);
router.route('/getTicketForUnAuthUser/:id').get(getTicketForUnAuthUser)
router.route('/getTicket/:email').get(verifytoken, getTicketByEmail);
router.route('/get_Seat').patch(get_Seat);
router.route('/').post(verifytoken, insertBooking);


module.exports = router;