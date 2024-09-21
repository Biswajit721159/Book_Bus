const BusOwnerDataBase = require("../models/BusOwnerDataBase");

const busDataValidation = (bus_name, Total_seat, station_data, res) => {
    if (bus_name.length < 5 || bus_name.length > 50) {
        return res.status(400).json({ message: 'Bus name must be between 5 and 50 characters.' });
    }

    if (Total_seat < 11 || Total_seat > 99) {
        return res.status(400).json({ message: 'Total seat must be between 11 and 99.' });
    }

    return checkStationData(station_data, res);
};

function checkStationData(stations, res) {
    if (!Array.isArray(stations)) {
        return res.status(400).json({ message: 'Station data must be an array.' });
    }

    if (stations.length < 2 || stations.length > 39) {
        return res.status(400).json({ message: 'Station data must have between 2 and 39 stations.' });
    }

    for (let index = 0; index < stations.length; index++) {
        const station = stations[index];

        if (!station.station || typeof station.station !== 'string') {
            return res.status(400).json({ message: `Station at index ${index} must have a valid "station" name.` });
        }

        if (!station.arrived_time || !/^\d{2}:\d{2}$/.test(station.arrived_time)) {
            return res.status(400).json({ message: `Station at index ${index} must have a valid "arrived_time" in HH:MM format.` });
        }
        try {
            let Distance_from_Previous_Station = parseInt(station.Distance_from_Previous_Station);
            if (Distance_from_Previous_Station < 0) {
                return res.status(400).json({ message: `Station at index ${index} must have a valid "Distance_from_Previous_Station" as a number and not negative.` });
            }
        } catch {
            return res.status(400).json({ message: `Station at index ${index} must have a valid "Distance_from_Previous_Station" as a number.` });
        }
    }

    return true; // If all checks pass
}

const addBusValidation = async (req, res, next) => {
    try {
        let { bus_name, email, station_data, status, Total_seat } = req.body;

        if (!['pending', 'rejected', 'approved'].includes(status)) {
            return res.status(400).json({ message: 'Invalid bus status' });
        }

        let bus = await BusOwnerDataBase.findOne({ bus_name });
        if (bus) {
            return res.status(400).json({ message: 'Bus name already exists' });
        }

        const validationPassed = busDataValidation(bus_name, Total_seat, station_data, res);
        if (validationPassed !== true) return; // Stop flow if validation fails

        next();
    } catch (error) {
        return res.status(500).json({ message: "Server Down" });
    }
};

const editBusValidation = async (req, res, next) => {
    try {
        let { _id, bus_name, email, station_data, status, Total_seat } = req.body;

        let bus = await BusOwnerDataBase.findById(_id);
        if (!bus) {
            return res.status(400).json({ message: 'Bus not found' });
        }

        if (bus.email !== email) {
            return res.status(400).json({ message: 'Email mismatch' });
        }

        if (!['pending', 'rejected', 'approved'].includes(status)) {
            return res.status(400).json({ message: 'Invalid bus status' });
        }

        const validationPassed = busDataValidation(bus_name, Total_seat, station_data, res);
        if (validationPassed !== true) return; // Stop flow if validation fails

        next();
    } catch (error) {
        return res.status(500).json({ message: "Server Down" });
    }
};

module.exports = {
    addBusValidation,
    editBusValidation
};
