module.exports = class IGDB {
    constructor(meth = 'GET', body = false) {
        const header = {
            'Accept': 'application/json',
            'user-key': '620183c2f4a8f3a16bc723a4455ae140'
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