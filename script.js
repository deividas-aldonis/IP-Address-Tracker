const submitBtn = document.querySelector(".submit-btn");
const formInput = document.querySelector(".form-input");
const ipifyURL = "https://ipapi.co/5.20.185.228/json/";
const geoIpifyURL =
  "https://geo.ipify.org/api/v2/country?apiKey=at_WaeVZbFRO3gB3eI5kPvLg0xbYDD3y&ipAddress=";

const ipEl = document.querySelector(".data-ip");
const ispEl = document.querySelector(".data-isp");
const locationEl = document.querySelector(".data-location");
const timezoneEl = document.querySelector(".data-timezone");

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

const getCoords = async (userInput) => {
  try {
    const res = await fetch(`https://ipapi.co/${userInput}/json/`);
    const data = await res.json();

    if (data.error) {
      alert(`An error occurred\nReason: ${data.reason} (${data.ip})`);
      return;
    }

    const {
      ip,
      city,
      country,
      postal,
      isp,
      utc_offset,
      org,
      latitude,
      longitude,
    } = data;
    const utc = utc_offset.slice(0, 3) + ":" + utc_offset.slice(3);

    ipEl.textContent = ip;
    ispEl.textContent = org;
    locationEl.textContent = `${city}, ${country} ${postal}`;
    timezoneEl.textContent = `UTC ${utc}`;

    ipEl.classList.remove("hidden");
    ispEl.classList.remove("hidden");
    locationEl.classList.remove("hidden");
    timezoneEl.classList.remove("hidden");
  } catch (error) {
    console.error(error);
    alert("An error occurred, please try again later.");
  }
};

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const inputValue = formInput.value.trim();

  if (inputValue.length < 1) return;

  getCoords(inputValue);
});
