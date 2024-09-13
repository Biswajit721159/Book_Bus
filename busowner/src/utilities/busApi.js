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

export {
    getBuses,
    findBusByFilter,
}