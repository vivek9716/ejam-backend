const express = require('express');
var OAuth = require('oauth');

const app = express();

var cors = require('cors');
const port = process.env.PORT || 8000;
app.use(cors());

app.get('/', async (req, res) => {
  const { query } = req;
  const { city } = query;
  if (city) {
    const data = await getCityInfo(city);
    res.json(data);
  } else {
    res.json({'error': 'Please enter a valid city name.'});
  }
});


const getCityInfo = (city) => {
  var header = {
      "X-Yahoo-App-Id": process.env.APPID
  };
  var request = new OAuth.OAuth(
      null,
      null,
      process.env.CLIENT_KEY,
      process.env.CLIENT_SECRET,
      '1.0',
      null,
      'HMAC-SHA1',
      null,
      header
  );
  return new Promise ((resolve, reject) => {
    request.get(
        `https://weather-ydn-yql.media.yahoo.com/forecastrss?location=${city},us&format=json`,
        null,
        null,
        function (err, data, result) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        }
    );
  });
}

app.listen(port, () => console.log(`port:${port}`))
