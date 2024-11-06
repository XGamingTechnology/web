// Inisialisasi peta dengan pusat Jakarta
const map = L.map('map').setView([-6.2088, 106.8456], 11); // Koordinat Jakarta

// Tambahkan basemap Dark dan Light sebagai layer kontrol
const lightBase = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>',
  maxZoom: 19
});

const darkBase = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>',
  maxZoom: 19
});

// Default basemap yang dipilih saat peta pertama kali dimuat
darkBase.addTo(map);

// Tambahkan kontrol layer untuk memungkinkan switching antara dark dan light basemap
L.control.layers({
  'Light Mode': lightBase,
  'Dark Mode': darkBase
}).addTo(map);

// Load geojson untuk titik (data point perjalanan)
fetch('data/tutupan.geojson')
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
        radius: 5,
        color: '#ff7800',
        fillOpacity: 0.7
      })
    }).addTo(map);
  });

// Load geojson untuk garis rute
fetch('data/rute.geojson')
  .then(response => response.json())
  .then(data => {
    // Ambil semua segmen dari fitur
    const segments = data.features;

    // Fungsi untuk menampilkan setiap segmen dengan jeda animasi
    const animateSegments = (index = 0) => {
      // Cek jika indeks masih dalam batas jumlah segmen
      if (index < segments.length) {
        // Tambahkan segmen saat ini ke peta
        const segment = L.geoJSON(segments[index], {
          style: { color: 'blue', weight: 4 }
        }).addTo(map);

        // Tampilkan setiap segmen dengan jeda waktu
        setTimeout(() => {
          map.removeLayer(segment); // Hapus segmen sebelumnya jika ingin animasi berkelanjutan
          animateSegments(index + 1); // Panggil fungsi untuk segmen berikutnya
        }, 3000); // Interval waktu antara setiap segmen dalam milidetik (15 detik)
      } else {
        // Jika sudah mencapai akhir, ulangi dari segmen pertama setelah jeda
        setTimeout(() => {
          animateSegments(0); // Mulai kembali dari segmen pertama
        }, 15000);
      }
    };

    // Mulai animasi dari segmen pertama
    animateSegments();
  });
