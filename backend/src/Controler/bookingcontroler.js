const Booking = require('../models/Booking_models')
const Bus_detail = require('../models/Bus_detail_models')
let FavouriteJourney = require('../models/FavouriteJourney_models')
let { ApiResponse } = require("../utils/ApiResponse.js");
let mongoose = require('mongoose');


const cancelTicket = async (req, res) => {
    try {
        let { booking_id, index } = req.body;
        let booking = await Booking.findOne({ _id: booking_id });
        if (!booking) {
            return res.status(400).json(new ApiResponse(400, null, "Booking id not found"));
        } else if (index === undefined || index === null) {
            return res.status(400).json(new ApiResponse(400, null, "index not found"));
        }
        booking.status[index] = false;
        booking.save();
        return res.status(200).json(new ApiResponse(200, booking, "Ticket cancel successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, "Server Down"));
    }
}

const addAndRemoveFromWishList = async (req, res) => {
    try {
        const bookingId = req.body.id;
        const is_wishlist = req.body.is_wishlist;
        if (!bookingId) {
            return res.status(404).json(new ApiResponse(404, null, "Booking id not found"));
        } else if (!is_wishlist) {
            return res.status(404).json(new ApiResponse(404, null, "is_wishlist is empty or not found"));
        }
        let booking = await Booking.findOne({ _id: bookingId });
        if (is_wishlist === "yes") {
            booking.is_wishlist = true;
        } else {
            booking.is_wishlist = false;
        }
        booking.save();
        if (booking) {
            return res.status(200).json(new ApiResponse(200, booking, "success"));
        } else {
            return res
                .status(500)
                .json(new ApiResponse(500, [], "Server down !"));
        }
    } catch {
        return res
            .status(500)
            .json(new ApiResponse(500, [], "Server down !"));
    }
}

const getTicketByidFprAuthenticateUser = async (req, res) => {
    try {
        let id = req.params._id
        let result = await Booking.find({ id: id });
        if (result) return res
            .status(200)
            .json(new ApiResponse(200, result, "Success"));
        else return res
            .status(404)
            .json(new ApiResponse(404, [], "Return Not Found"));
    } catch {
        return res
            .status(500)
            .json(new ApiResponse(500, [], "Server down !"));
    }
}

const getTicketByEmail = async (req, res) => {
    try {
        let limit = 10;
        let { page } = req.params;
        page = page ? parseInt(page) : 1;

        let count = await Booking.countDocuments({ useremail: req.params.email });

        let result = await Booking.find({ useremail: req.params.email })
            .select(["-updatedAt", "-__v", "-createAt"])
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });
        let data = {
            bookingData: result,
            totalPage: Math.ceil(count / limit)
        };

        if (result.length > 0) {
            return res.status(200).json(new ApiResponse(200, data, "success"));
        } else {
            return res.status(404).json(new ApiResponse(404, [], "Ticket not found!"));
        }
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, [], "Server down!"));
    }
}

const get_Seat = async (req, res) => {
    try {
        let src = req.body.start_station.toUpperCase()
        let dist = req.body.end_station.toUpperCase()
        let date = req.body.date
        let bus_id = req.body.bus_id
        if (src === dist || !date || !bus_id) {
            return res
                .status(404)
                .json(new ApiResponse(404, [], "Not Found"));
        }

        let Bookingdata = await Booking.find({ bus_id: bus_id, date: date });
        let busData = await Bus_detail.find({ _id: bus_id });
        // let busData = []
        // for (let i = 0; i < ffff.length; i++) {
        //     if (ffff[i]._id == bus_id) {
        //         busData.push(ffff[i])
        //     }
        // }
        let bus = busData[0].station_data

        let srcToDistStation = new Set()
        let count = 0;
        let total_distance = 0

        for (let i = 0; i < bus.length; i++) {
            let s = bus[i].station.toUpperCase()
            if (s == src) {
                count++;
                srcToDistStation.add(src)
                for (let j = i + 1; j < bus.length; j++) {
                    let s1 = bus[j].station.toUpperCase()
                    let distanceFromPreviousStation = parseInt(bus[j].Distance_from_Previous_Station)
                    if (s1 == dist) {
                        total_distance += distanceFromPreviousStation
                        srcToDistStation.add(dist)
                        count += 1;
                        break;
                    }
                    else {
                        total_distance += distanceFromPreviousStation
                        srcToDistStation.add(s1);
                    }
                }
                break;
            }
        }

        let countBookingSeat = 0
        let seat = new Set()
        if (count == 0 || count == 1) {
            // write some code hare for invalid test case .
        }
        else {
            for (let i = 0; i < Bookingdata.length; i++) {
                let srcStation = Bookingdata[i].src
                let distStation = Bookingdata[i].dist
                if (checkStationIsPresentOrNot(srcStation, distStation, srcToDistStation, bus) == true) {
                    // countBookingSeat += parseInt(Bookingdata[i].person.length)
                    let arr = Bookingdata[i].seat_record;
                    let status = Bookingdata[i].status;
                    for (let j = 0; j < arr.length; j++) {
                        if (status[j]) {
                            seat.add(arr[j]);
                            countBookingSeat++;
                        }
                    }
                }
            }
        }
        let totalSeat = parseInt(busData[0].Total_seat)
        let ans = []
        for (let i = 1; i <= totalSeat; i++) {
            let obj = { isbooked: false }
            if (seat.has(i) == true) {
                obj.isbooked = true;
            }
            ans.push(obj)
        }
        let nowAvailable_seat = totalSeat - countBookingSeat;
        return res.status(200).json(new ApiResponse(200, { 'nowAvailable_seat': nowAvailable_seat, 'total_seat': totalSeat, 'BookingRecord': ans, 'total_distance': total_distance }, "Seat found"))

    } catch {
        return res
            .status(500)
            .json(new ApiResponse(500, [], "Server down !"));
    }
}

const GetTicketById = async (req, res) => {
    try {
        let Ticket = await Booking.findOne({ _id: req.params.id });
        if (Ticket && Ticket?.bus_id) {
            let bus = await Bus_detail.findOne({ _id: Ticket.bus_id })
            let journey = await FavouriteJourney.findOne({ 'booking_id': Ticket?._id })
            let ans = {
                _id: Ticket._id,
                bus_name: bus.bus_name,
                total_distance: Ticket.total_distance,
                total_rupees: Ticket.total_money,
                src: Ticket.src,
                dist: Ticket.dist,
                booking_date: await TransfromData(Ticket.createdAt),
                date: Ticket.date,
                seat_record: Ticket.seat_record,
                person: Ticket.person,
                isFavouriteJourney: journey === null ? false : true,
                status: Ticket?.status,
            }
            return res
                .status(200)
                .json(new ApiResponse(200, ans, "Ticket successfully found !"));
        } else {
            return res
                .status(404)
                .json(new ApiResponse(404, {}, "Data Not found !"));
        }
    } catch {
        return res
            .status(500)
            .json(new ApiResponse(500, {}, "Server down !"));
    }
}

function checkStationIsPresentOrNot(src, dist, set, bus) {
    src = src.toUpperCase()
    dist = dist.toUpperCase()
    for (let i = 0; i < bus.length; i++) {
        let s = bus[i].station.toUpperCase()
        if (s == src) {
            for (let j = i; j < bus.length; j++) {
                let s1 = bus[j].station.toUpperCase()
                if (s1 == dist) {
                    if (set.has(s1)) {
                        return true;
                    }
                    break;
                }
                else {
                    if (set.has(s1)) {
                        return true;
                    }
                }
            }
            break;
        }
    }
    return -1;
}

const insertBooking = async (req, res) => {
    try {
        let person = req.body?.person;
        let seat_record = req.body?.seat_record;
        if (!person || !person || person?.length != seat_record?.length || person?.length === 0 || seat_record?.length === 0) {
            return res.status(400).json(new ApiResponse(400, [], "Missing parameter"));
        }
        let status = new Array(person?.length).fill(true);
        req.body.status = status;
        let todayResultFound = await Booking.findOne({
            date: req.body.date,
            bus_id: req.body.bus_id,
            useremail: req.user?.email,
            src: req.body?.src,
            dist: req.body?.dist,
        });
        if (todayResultFound) {
            return res.status(400).json(new ApiResponse(400, [], "Today you are not allowed to book."));
        }
        let result = await Booking.create(req.body);
        if (result) {
            return res
                .status(201)
                .json(new ApiResponse(201, [], "Booking Successfull"));
        }
        else {
            return res
                .status(500)
                .json(new ApiResponse(500, [], "Server down !"));
        }
    }
    catch {
        return res
            .status(500)
            .json(new ApiResponse(500, [], "Server down !"));
    }
}

const getBookingDatabyDate = async (req, res) => {
    try {
        let date = req.body.date;
        let bus_id = req.body.bus_id;
        let result = await Booking.find({ bus_id: bus_id, date: date });
        return res
            .status(200)
            .json(new ApiResponse(200, result, "success"));
    }
    catch {
        return res
            .status(500)
            .json(new ApiResponse(500, [], "Server down !"));
    }
}

const getTicketForUnAuthUser = async (req, res) => {
    try {
        let Ticket = await Booking.findOne({ _id: req.params.id });
        if (Ticket && Ticket?.bus_id) {
            let bus = await Bus_detail.findOne({ _id: Ticket.bus_id })
            let ans = {
                bus_name: bus.bus_name,
                total_distance: Ticket.total_distance,
                src: Ticket.src,
                dist: Ticket.dist,
                booking_date: await TransfromData(Ticket.createdAt),
                date: Ticket.date,
                seat_record: Ticket.seat_record,
                status: Ticket.status,
            }
            return res
                .status(200)
                .json(new ApiResponse(200, ans, "Ticket successfully found !"));
        } else {
            return res
                .status(404)
                .json(new ApiResponse(404, {}, "Data Not found !"));
        }
    } catch {
        return res
            .status(500)
            .json(new ApiResponse(500, {}, "Server down !"));
    }
}

async function TransfromData(createdAtString) {
    const createdAtDate = new Date(createdAtString);
    const year = createdAtDate.getFullYear();
    const month = String(createdAtDate.getMonth() + 1).padStart(2, "0");
    const day = String(createdAtDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
}

const getBookingData = async (req, res) => {
    try {
        if (!req.user || req.user.role !== '200') {
            return res.status(403).json(new ApiResponse(403, null, 'Unauthorized'));
        }

        let limit = 15;
        let { page, Email, Src, Dist, BookingDate, BusName } = req.query;
        page = page ? parseInt(page) : 1;
        let skip = (page - 1) * limit;
        let sortFilter = { updatedAt: -1 };
        let matchConditions = {};

        if (Email) {
            matchConditions.useremail = { $regex: Email, $options: "i" };
        }
        if (Src) {
            matchConditions.src = { $regex: Src, $options: "i" };
        }
        if (Dist) {
            matchConditions.dist = { $regex: Dist, $options: "i" };
        }
        if (BookingDate) {
            matchConditions.date = { $regex: BookingDate, $options: "i" };
        }

        const createPipeline = (skip, limit, sortFilter) => {
            let pipeline = [
                {
                    $lookup: {
                        from: "bus_details",
                        localField: "bus_id",
                        foreignField: "_id",
                        as: "bus"
                    }
                },
                {
                    $unwind: {
                        path: "$bus",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: matchConditions
                },
                ...(BusName ? [{
                    $match: {
                        "bus.bus_name": { $regex: BusName, $options: "i" }
                    }
                }] : []),
            ];

            if (sortFilter) {
                pipeline.push({ $sort: sortFilter });
            }
            if (typeof skip !== 'undefined' && typeof limit !== 'undefined') {
                pipeline.push({ $skip: skip }, { $limit: limit });
            }

            return pipeline;
        };

        let dataPipeline = createPipeline(skip, limit, sortFilter);
        let countPipeline = createPipeline();

        let totalRecordResult = await Booking.aggregate([...countPipeline, { $count: "total" }]);
        let totalRecord = totalRecordResult.length > 0 ? totalRecordResult[0].total : 0;

        let bookingData = await Booking.aggregate(dataPipeline);
        let totalPage = Math.ceil(totalRecord / limit);

        return res.status(200).json(new ApiResponse(200, { bookingData, totalPage }, 'success'));

    } catch (error) {
        console.error("Error fetching booking data:", error);
        return res.status(500).json(new ApiResponse(500, null, 'Server down!'));
    }
};


module.exports = { addAndRemoveFromWishList, getTicketByidFprAuthenticateUser, getTicketByEmail, get_Seat, GetTicketById, insertBooking, getBookingDatabyDate, getTicketForUnAuthUser, cancelTicket, getBookingData }