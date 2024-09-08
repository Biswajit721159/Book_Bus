const api = process.env.REACT_APP_API

const register = async (data) => {
    try {
        let response = await fetch(`${api}/Adminpanel/register`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        let res = await response.json();
        return res;
    } catch (e) {
        throw new Error(e?.message);
    }
}

const login = async (data) => {
    try {
        let response = await fetch(`${api}/Adminpanel/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        let res = await response.json();
        return res;
    } catch (e) {
        throw new Error(e?.message);
    }
}

const forgotPassword = () => {
    try {

    } catch (e) {

    }
}

const logInByToken = async (token) => {
    try {
        let response = await fetch(`${api}/Adminpanel/logInByToken`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
        let res = await response.json();
        return res;
    } catch (e) {
        throw new Error(e?.message);
    }
}

export { register, login, forgotPassword, logInByToken }