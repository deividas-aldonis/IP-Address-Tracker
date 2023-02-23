const submitBtn = document.querySelector(".submit-btn");
const formInput = document.querySelector(".form-input");
const ipEl = document.querySelector(".data-ip");
const ispEl = document.querySelector(".data-isp");
const locationEl = document.querySelector(".data-location");
const timezoneEl = document.querySelector(".data-timezone");
const header = document.querySelector(".header");

let map;
let mapIcon = L.icon({
  iconUrl: "./images/icon-location.svg",
  iconSize: [30, 40],
});

const mapDiv = document.getElementById("map");
const data = document.querySelector(".data");
const content = document.querySelector(".content");
const goUp = document.querySelector(".go-up");

const adjustContentSize = () => {
  const contentHeight = content.offsetHeight - data.offsetHeight / 2;
  content.style.height = contentHeight + "px";
};
adjustContentSize();

const resizeObserver = new ResizeObserver(() => {
  if (!map) return;
  map.invalidateSize();
});
resizeObserver.observe(mapDiv);

const headerObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const intersecting = entry.isIntersecting;

    if (intersecting && !goUp.classList.contains("hide")) {
      goUp.classList.add("hide");
    }
  });
});

headerObserver.observe(header);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const intersecting = entry.isIntersecting;
    if (intersecting) {
      goUp.classList.remove("hide");
    }
  });
});

goUp.addEventListener("click", () => {
  window.scroll({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
});

const showOnMap = (lat, lon) => {
  if (!map) {
    map = L.map("map", { zoomControl: false }).setView([lat, lon], 13);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    L.marker([lat, lon], { icon: mapIcon }).addTo(map);
  } else {
    map.setView([lat, lon], 13);
    L.marker([lat, lon], { icon: mapIcon }).addTo(map);
  }

  observer.observe(document.querySelector(".leaflet-control-attribution"));
};

const getCoords = async (userInput) => {
  let url;

  if (!userInput) url = "https://ipapi.co/json/";
  else url = `https://ipapi.co/${userInput}/json/`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      alert(`An error occurred\nReason: ${data.reason} (${data.ip})`);
      return;
    }

    const { ip, city, country, postal, utc_offset, org, latitude, longitude } =
      data;
    const utc = utc_offset.slice(0, 3) + ":" + utc_offset.slice(3);

    ipEl.textContent = ip;
    ispEl.textContent = org;
    locationEl.textContent = `${city}, ${country} ${postal}`;
    timezoneEl.textContent = `UTC ${utc}`;

    ipEl.classList.remove("hidden");
    ispEl.classList.remove("hidden");
    locationEl.classList.remove("hidden");
    timezoneEl.classList.remove("hidden");

    showOnMap(latitude, longitude);
    formInput.value = "";
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

window.addEventListener("load", () => getCoords());
