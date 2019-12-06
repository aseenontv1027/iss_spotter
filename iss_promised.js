const request = require('request-promise-native');

const fetchMyIP = function() {
  return request('https://api.ipify.org?format=json');
};

const fetchCoordsByIP = function(body) {
  const data = JSON.parse(body);
  return request(`https://ipvigilante.com/${data.ip}`);
};

const fetchISSFlyOverTimes = function(body) {
  const data1 = JSON.parse(body);
  const coordinates = {};
  coordinates["latitude"] = String(data1.data.latitude);
  coordinates["longitude"] = String(data1.data.longitude);
  return request(`http://api.open-notify.org/iss-pass.json?lat=${coordinates.latitude}&lon=${coordinates.longitude}`);
};

const nextISSTimesForMyLocation = function() {
  
  return fetchMyIP()
  .then(fetchCoordsByIP)
  .then(fetchISSFlyOverTimes)
  .then((data) => {
    const { response } = JSON.parse(data);
    return response; //Where does this go? 
  });
};

module.exports = { nextISSTimesForMyLocation };