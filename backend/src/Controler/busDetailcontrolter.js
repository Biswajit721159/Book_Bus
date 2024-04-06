const Bus_detail = require('../models/Bus_detail_models')
let { ApiResponse } = require("../utils/ApiResponce");

const AddBus = async (req, res) => {
    try {
        let result = await Bus_detail.create(req.body);
        if (result) {
            return res.status(201).json(new ApiResponse(201, null, "Bus added sucessfully"));
        } else {
            return res.status(500).json(new ApiResponse(500, null, "server down !"))
        }
    } catch {
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Server down !"));
    }
}

const getFirstTenBus = async (req, res) => {
    try {
        let result = await Bus_detail.find().limit(10);
        let ans = []
        for (let i = 0; i < result.length; i++) {
            let arr = result[i].station_data
            let n = arr.length;
            let total_distance = 0
            for (let k = 0; k < n; k++) {
                total_distance += parseInt(arr[k].Distance_from_Previous_Station);
            }
            let obj = {
                bus_id: result[i]._id,
                bus_name: result[i].bus_name,
                start_station: arr[0].station,
                end_station: arr[n - 1].station,
                start_arrived_time: arr[0].arrived_time,
                end_arrive_time: arr[n - 1].arrived_time,
                total_time: findDifferTime(arr, 0, arr.length),
                total_distance: total_distance
            }
            ans.push(obj)
        }
        if (ans) return res.status(200).json(new ApiResponse(200, ans, "Bus is found"))
        else {
            return res.status(404)
                .json(new ApiResponse(404, null, "Bus not found"))
        }
    }
    catch {
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Server down !"));
    }
}

function FindInMinutes(s1, s2) {
    let hh1 = s1.substr(0, 2);
    let hh2 = s2.substr(0, 2);
    let mm1 = s1.substr(3, 2);
    let mm2 = s2.substr(3, 2);

    hh1 = parseInt(hh1);
    hh2 = parseInt(hh2);
    mm1 = parseInt(mm1);
    mm2 = parseInt(mm2);

    if (hh2 < hh1) hh2 += 23
    let hhDiff = hh2 - hh1;
    let mmDiff = mm2 - mm1;
    if (mmDiff < 0) {
        mmDiff += 60;
        hhDiff -= 1;
    }
    return hhDiff * 60 + mmDiff
}

function findDifferTime(arr, a, b) {
    let ans = 0;
    for (let i = a; i < b - 1; i++) {
        let s1 = arr[i].arrived_time;
        let s2 = arr[i + 1].arrived_time;
        ans += FindInMinutes(s1, s2);
    }
    let hhDiff = parseInt(ans / 60);
    let mmDiff = parseInt(ans - hhDiff * 60);
    let res = hhDiff + 'h:' + mmDiff + 'm'
    return res;

}

const GetBusBySrcDist = async (req, res) => {
    try {
        start_station = req.body.start_station;
        end_station = req.body.end_station;

        let result = await Bus_detail.find();
        let ans = []

        for (let i = 0; i < result.length; i++) {
            let arr = result[i].station_data
            k = 0;
            let x = 0;
            let total_distance = 0;
            let start_ind = -1;
            let end_ind = -1;
            for (k = 0; k < arr.length; k++) {
                if (arr[k].station.toUpperCase() == start_station) {
                    start_ind = k;
                    x++;
                    break;
                }
            }
            if (x == 1) {
                for (; k < arr.length; k++) {
                    if (arr[k].station.toUpperCase() == end_station) {
                        total_distance += (parseInt(arr[k].Distance_from_Previous_Station))
                        end_ind = k; x++; break;
                    }
                    else {
                        total_distance += (parseInt(arr[k].Distance_from_Previous_Station))
                    }
                }
                if (x == 2) {
                    let obj = {
                        bus_id: result[i]._id,
                        bus_name: result[i].bus_name,
                        start_station: start_station,
                        end_station: end_station,
                        start_arrived_time: arr[start_ind].arrived_time,
                        end_arrive_time: arr[end_ind].arrived_time,
                        total_time: findDifferTime(arr, start_ind, end_ind + 1),
                        total_distance: total_distance
                    }
                    ans.push(obj)
                }
            }
        }
        if (ans) {
            res.status(200).json(new ApiResponse(200, ans, "Bus found successFully"))
        } else {
            res.status(404).json(new ApiResponse(404, null, "Bus not found"))
        }
    } catch {
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Server down !"));
    }
}

const GetAllStation = async (req, res) => {
    try {
        let result = await Bus_detail.find({})
        ans = new Set()
        for (let i = 0; i < result.length; i++) {
            for (let j = 0; j < result[i].station_data.length; j++) {
                ans.add(result[i].station_data[j].station.toUpperCase())
            }
        }
        let vec = Array.from(ans)
        if (vec)
            return res
                .status(200)
                .json(new ApiResponse(200, vec, "Station is successFully found"));
        else {
            return res
                .status(404)
                .json(new ApiResponse(404, vec, "Station is not found"));
        }
    } catch {
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Server down !"));
    }
}

const GetBusDetailById = async (req, res) => {
    try {
        let bus_id = req.params._id
        let nums = await Bus_detail.find({ id: bus_id }).toArray();
        if (nums) {
            return res.status(200).json(new ApiResponse(200, nums, "Bus successfully found"))
        } else {
            return res.status(404).json(new ApiResponse(404, null, "Bus Not Found"))
        }
    }
    catch {
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Server down !"));
    }
}

module.exports = { GetBusDetailById, GetAllStation, GetBusBySrcDist, getFirstTenBus, AddBus }
