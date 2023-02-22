const ipifyURL = "https://ipapi.co/5.20.185.228/json/";
const geoIpifyURL =
  "https://geo.ipify.org/api/v2/country?apiKey=at_WaeVZbFRO3gB3eI5kPvLg0xbYDD3y&ipAddress=";

const checkBalance = async () => {
  //   const res = await fetch(ipifyURL);

  //   const data = await res.json();
  //   console.log(data);
  //   //   const res2 = await fetch(geoIpifyURL + ip);
  //   //   const data2 = await res2.json();

  //   //   console.log(data2);

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const map = L.map("map", { zoomControl: false }).setView(
        [latitude, longitude],
        13
      );

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 20,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const marker = L.marker([latitude, longitude]).addTo(map);
    });
  } else {
    /* geolocation IS NOT available */
  }
};

checkBalance();
