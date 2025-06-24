#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

// Kết nối DHT11
#define DHTPIN 15
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// WiFi credentials
const char* ssid = "Hoang Phuc Sau";
const char* password = "";

// URL của backend Render
const char* serverName = "https://esp32dht11-backend.onrender.com/update";  // Cập nhật theo backend của bạn

void setup() {
  Serial.begin(115200);
  dht.begin();

  WiFi.begin(ssid, password);
  Serial.print("Đang kết nối WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi đã kết nối!");
}

void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (!isnan(h) && !isnan(t)) {
    sendDataToServer(t, h);
  } else {
    Serial.println("❌ Không đọc được DHT11");
  }

  delay(10000);  // gửi mỗi 10 giây
}

void sendDataToServer(float temp, float hum) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = String(serverName) + "?temp=" + String(temp, 1) + "&hum=" + String(hum, 1);
    http.begin(url);
    int httpCode = http.GET();

    Serial.print("📡 Đã gửi: Temp = "); Serial.print(temp);
    Serial.print("°C, Hum = "); Serial.print(hum); Serial.print("% -> ");
    Serial.println("Phản hồi server: " + String(httpCode));

    http.end();
  } else {
    Serial.println("⚠️ WiFi chưa kết nối");
  }
} 