module.exports = class IGDB {
    constructor(meth = 'GET', body = false) {
        require('dotenv').config();
        const header = {
            'Accept': 'application/json',
            'user-key': process.env.API_KEY
        };
        const init = {
            method: meth,
            headers: header
        }
        if (body) {
            init.body = body;
        }
        return init;
    }
}