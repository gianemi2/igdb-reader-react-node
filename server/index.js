const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const storage = require('node-persist');

const IGDB = require('./IGDB');
const app = express();

const APIURL = 'https://api-v3.igdb.com';

app.use(cors());
app.listen(process.env.PORT || 9000, () => { console.log('listening on 9000') });
setupCache();

async function setupCache() {
    await storage.init({
        ttl: true
    });
}

async function fetchFromGames(platform = 48, paging = 0) {
    const today = (Date.now() / 1000).toFixed();
    const cachedData = await fetchFromCache(platform, paging);
    if (cachedData) {
        return cachedData;
    }
    const gamePerPage = 6;
    const offset = gamePerPage * paging;
    const body = `
    fields *,cover.*,platforms.*;
    where platforms = [${platform}] & popularity > 3 & first_release_date < ${today};
    sort first_release_date desc;
    limit ${gamePerPage};
    offset ${offset};
    `;
    const headers = new IGDB('POST', body);
    const response = await fetch(APIURL + '/games', headers);
    const data = await response.json();

    // Save results on cache
    let pagedData = {
        [paging]: data
    }
    if (paging > 0) {
        let cache = await storage.getItem(platform);
        pagedData = { ...cache, ...pagedData };
    }
    await storage.updateItem(platform, pagedData);
    return data;
}

async function fetchFromCache(platform, paging) {
    const cache = await storage.getItem(platform);
    if (typeof cache !== 'undefined' && typeof cache[paging] !== 'undefined') {
        return cache[paging];
    } else {
        return false;
    }
}

app.get('/test', async (req, res) => {
    res.json('test');
})

app.get('/cache', async (req, res) => {
    const cacheItem = await storage.getItem('130');
    res.json(cacheItem);
})

async function searchFromGames(searchQuery, paging = 0) {
    const gamePerPage = 6;
    const offset = gamePerPage * paging;
    const body = `
    fields *,cover.*,platforms.*;
    search "${searchQuery}";
    limit ${gamePerPage};
    offset ${offset};
    `;
    const headers = new IGDB('POST', body);
    const response = await fetch(APIURL + '/games', headers);
    return await response.json();
}

app.get('/games/:platform/page/:page', async (req, res) => {
    const platform = req.params.platform;
    const paging = req.params.page;

    const response = await fetchFromGames(platform, paging);
    res.json(response);
})

app.post('/search/:search/page/:page', async (req, res) => {
    const searchQuery = req.params.search;
    const paging = req.params.page;

    const response = await searchFromGames(searchQuery, paging);
    res.json(response);
})

app.get('/api/status', async (req, res) => {
    const headers = new IGDB();
    const response = await fetch(APIURL + '/api_status', headers);
    const data = await response.json();
})