const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

app.use(cors());
app.use(express.static(__dirname)); // Để truy cập index.html và file tĩnh khác

let latestData = {
  temp: 0,
  hum: 0,
  time: '--:--:--'
};

let history = [];  // Lưu lịch sử 100 mẫu gần nhất

// ESP32 gọi hàm này để cập nhật dữ liệu
app.get('/update', (req, res) => {
  const { temp, hum } = req.query;
  if (temp && hum) {
    const now = new Date().toLocaleTimeString();
    const record = {
      temp: parseFloat(temp),
      hum: parseFloat(hum),
      time: now
    };
    latestData = record;
    history.push(record);

    // Chỉ lưu tối đa 100 bản ghi
    if (history.length > 100) history.shift();

    console.log(`✅ Dữ liệu mới: ${temp}°C - ${hum}% lúc ${now}`);
    res.send("Dữ liệu đã được cập nhật!");
  } else {
    res.status(400).send("Thiếu dữ liệu temp hoặc hum.");
  }
});

// Trang web gọi để lấy dữ liệu mới nhất
app.get('/status', (req, res) => {
  res.json(latestData);
});

// Trang web gọi để lấy toàn bộ lịch sử
app.get('/history', (req, res) => {
  res.json(history);
});

// Hiển thị giao diện
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Cổng chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Server đang chạy tại http://localhost:${PORT}`);
});
