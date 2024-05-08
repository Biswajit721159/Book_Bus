let Router = require("express");
const router = Router();
let verifytoken = require('../Middelware/TokenVerification')
let { AddFavouriteJourney,
    RemoveFavouriteJourney,
    GetFavouriteJourneyByemail, } = require('../Controler/FavouriteJourneycontroler')

router.route('/AddFavouriteJourney').post(AddFavouriteJourney);
router.route('/RemoveFavouriteJourney/:booking_id').delete(RemoveFavouriteJourney);
router.route('/GetFavouriteJourneyByemail/:email').get(GetFavouriteJourneyByemail);



module.exports = router;