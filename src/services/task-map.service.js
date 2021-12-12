import axios from 'axios';

const API_KEY = 'AIzaSyAwGiZvHMgXknOgVGzfiqUHedPY-M9aRpM';

export const taskMapService = {
    searchLoc,
    getLocAddress
}


async function searchLoc(searchVal) {
    try {
        return await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${searchVal}&key=${API_KEY}`
        );
    } catch (err) {
        console.log('Error in searchLoc (task-map.service):', err);
        throw err;
    }
}

async function getLocAddress(lat, lng) {
    try {
        return await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
        );
    } catch (err) {
        console.log('Error in getLocAddress (task-map.service):', err);
        throw err;
    }
}
