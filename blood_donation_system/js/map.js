let map;
let markers = [];

function initMap() {
  map = L.map('map').setView([10.762622, 106.660172], 11); // TP.HCM

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
}

function loadDonorsAndRequestsOnMap() {
  const donors = getDonors();
  const requests = getRescueRequests();

  // Giả lập tọa độ (thực tế nên dùng Geocoding API)
  const locations = {
    "BV Chợ Rẫy": [10.758056, 106.662222],
    "BV 115": [10.774444, 106.697222],
    "BV Hùng Vương": [10.747222, 106.666944],
  };

  donors.forEach(d => {
    if (locations[d.location]) {
      const [lat, lng] = locations[d.location];
      const marker = L.marker([lat, lng]).addTo(map)
        .bindPopup(`<b>${d.name}</b><br>Nhóm máu: ${d.bloodType}<br>Ngày hiến: ${d.date}`);
      markers.push(marker);
    }
  });

  requests.slice(0, 10).forEach(r => {
    if (locations[r.hospital]) {
      const [lat, lng] = locations[r.hospital];
      const marker = L.circleMarker([lat, lng], {color: 'red', radius: 10}).addTo(map)
        .bindPopup(`<b>CẦN MÁU GẤP</b><br>Bệnh nhân: ${r.patientName}<br>Nhóm máu: ${r.bloodNeeded}<br>Liên hệ: ${r.contactPhone}`);
      markers.push(marker);
    }
  });
}