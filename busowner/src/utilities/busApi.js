const api = process.env.REACT_APP_API
const getBuses = async (page = 1) => {
    try {
        const userinfo = JSON.parse(localStorage.getItem('user'))
        let response = await fetch(`${api}/businfo/getBuses/?${page}`, {
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
export {
    getBuses
}