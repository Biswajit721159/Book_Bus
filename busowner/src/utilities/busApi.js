const api = process.env.REACT_APP_API

const getBuses = async (page = 1) => {
    try {
        const userinfo = JSON.parse(localStorage.getItem('user'))
        let response = await fetch(`${api}/businfo/getBuses/?page=${page}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userinfo.auth}`
            }
        })
        let res = await response.json();
        return res;
    } catch (e) {
        throw new Error(e?.message);
    }
}

const findBusByFilter = async (page, approved = true, pending = false, rejected = false) => {
    try {
        const userinfo = JSON.parse(localStorage.getItem('user'));
        let searchParam = `page=${encodeURIComponent(page)}&approved=${encodeURIComponent(approved)}&pending=${encodeURIComponent(pending)}&rejected=${encodeURIComponent(rejected)}`;
        let data = await fetch(`${api}/businfo/findBussByFilter/?${searchParam}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userinfo.auth}`
            }
        })
            .then((response) => response.json());
        return data.data;
    } catch (e) {
        throw new Error(e.message);
    }
}

const AddBus = async (bus_name, seat, stationData) => {
    try {
        const userinfo = JSON.parse(localStorage.getItem('user'));
        let res = await fetch(`${api}/businfo/addBus`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userinfo.auth}`
            },
            body: JSON.stringify({
                email: userinfo.user.email,
                bus_name: bus_name,
                Total_seat: seat,
                station_data: stationData,
                status: 'pending',
            })
        }).then(response => response.json());
        return res;
    } catch (e) {
        throw new Error(e.message);
    }
}

const getBusById = async (id) => {
    try {
        let res = await fetch(`${api}/businfo/getBusById/${id}`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((data) => data.json());
        return res;
    } catch (e) {
        throw new Error(e.message);
    }
}

const getBussByEmail = async () => {
    try {
        const userinfo = JSON.parse(localStorage.getItem('user'));
        let res = await fetch(`${api}/businfo/getBussByEmail`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userinfo.auth}`
            },
        }).then(responce => responce.json());
        return res;
    } catch (e) {
        throw new Error(e?.message);
    }
}

const getBookingStatus = async (date, id) => {
    try {
        const userinfo = JSON.parse(localStorage.getItem('user'));
        let res = await fetch(`${api}/businfo/getBookingStatus`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userinfo.auth}`
            },
            body: JSON.stringify({
                date: date,
                bus_id: id
            })
        }).then(response => response.json());
        return res;
    } catch (e) {
        throw new Error(e.message);
    }
}

const editBus = async (data) => {
    try {
        const userinfo = JSON.parse(localStorage.getItem('user'));
        let res = await fetch(`${api}/businfo/editBus`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userinfo.auth}`
            },
            body: JSON.stringify(data)
        }).then(response => response.json());
        return res;
    } catch (e) {
        throw new Error(e.message);
    }
}


const getBookingForSuperAdmin = async (page) => {
    try {
        const userinfo = JSON.parse(localStorage.getItem('user'));
        let res = await fetch(`${api}/Booking/pagination/${page}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userinfo.auth}`
            },
            // body: JSON.stringify(data)
        }).then(response => response.json());
        return res.data;
    } catch (e) {
        throw new Error(e.message);
    }
}

export {
    getBuses,
    findBusByFilter,
    AddBus,
    getBusById,
    getBussByEmail,
    getBookingStatus,
    editBus,
    getBookingForSuperAdmin,
}