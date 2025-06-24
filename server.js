const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static(__dirname));

let latestData = { temp: 0, hum: 0, time: new Date().toLocaleTimeString() };

app.get('/update', (req, res) => {
  const { temp, hum } = req.query;
  if (temp && hum) {
    latestData = {
      temp: parseFloat(temp),
      hum: parseFloat(hum),
      time: new Date().toLocaleTimeString()
    };
    console.log(`[DHT11] Temp: ${temp}°C, Hum: ${hum}%`);
    res.send("Dữ liệu đã được cập nhật!");
  } else {
    res.status(400).send("Thiếu dữ liệu temp hoặc hum.");
  }
});

app.get('/status', (req, res) => {
  res.json(latestData);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Server đang chạy tại cổng ${PORT}`);
});
