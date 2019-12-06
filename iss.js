const request = require('request');

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org?format=json', (error, response, body) => {

    if (error) {
      callback(error);
      return;
    } else {
      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
        callback(Error(msg), null);
        return;
      } else {
        const data = JSON.parse(body);
        callback(null, String(data.ip));
      }
    }
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request('https://ipvigilante.com/' + ip, (error, response, body) => {
    if (error) {
      callback(error);
      return;
    } else {
      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching coordinates. Response: ${body}`;
        callback(Error(msg), null);
        return;
      } else {
        const data = JSON.parse(body);
        const coordinates = {};
        coordinates["latitude"] = String(data.data.latitude);
        coordinates["longitude"] = String(data.data.longitude);
        callback(null, coordinates);
      }
    }
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) {
      callback(error);
      return;
    } else {
      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching fly over times. Response: ${body}`;
        callback(Error(msg), null);
        return;
      } else {
        const data = JSON.parse(body);
        let flyby = [];
        flyby = data.response;
        callback(null, flyby);
      }
    }
  });
};

const nextISSTimesForMyLocation = function(callback) {

  fetchMyIP((error, ip) => {
    if (error) {
      callback(error);
      return;
    }
    console.log(ip);
    
    fetchCoordsByIP(ip, (error, data) => {
      if (error) {
        callback(error);
        return;
      }
      console.log(data);
      
      fetchISSFlyOverTimes(data, (error, data) => {
        if (error) {
          callback(error);
          return;
        }
        console.log(data);
        
        callback(null, data);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };