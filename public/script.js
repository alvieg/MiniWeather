window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      fetch("/weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        }),
      })
        .then((response) => response.json())
        .then(async (data) => {
          const weatherDiv = document.getElementById("weather");
          const loading = document.querySelector(".loading");

          if (data.error) {
            weatherDiv.innerHTML = `<p class="error">Error: ${data.error}</p>`;
          } else {
            await promisifiedSetTimeout(2000); // optional loading delay
            loading.style.display = "none";

            // Convert Unix timestamp to local time
            const sunrise = new Date(data.sunrise * 1000).toLocaleTimeString();
            const sunset = new Date(data.sunset * 1000).toLocaleTimeString();

            weatherDiv.innerHTML = `
              <h2>Weather in ${data.city}</h2>
              <img src="http://openweathermap.org/img/wn/${
                data.icon
              }@2x.png" alt="Weather icon">
              <p><strong>Description:</strong> ${data.description}</p>
              <p><strong>Temperature:</strong> ${data.temp?.toFixed(0)} °F</p>
              <p><strong>Feels Like:</strong> ${data.feels_like?.toFixed(
                0
              )} °F</p>
              <p><strong>Min/Max:</strong> ${data.temp_min?.toFixed(
                0
              )} / ${data.temp_max?.toFixed(0)} °F</p>
              <p><strong>Humidity:</strong> ${data.humidity}%</p>
              <p><strong>Pressure:</strong> ${data.pressure} hPa</p>
              <p><strong>Wind Speed:</strong> ${data.wind_speed} mph</p>
              <p><strong>Cloudiness:</strong> ${data.clouds}%</p>
              <p><strong>Sunrise:</strong> ${sunrise}</p>
              <p><strong>Sunset:</strong> ${sunset}</p>
            `;
            weatherDiv.style.display = "block";
          }
        });
    });
  } else {
    document.getElementById("weather").innerText =
      "Geolocation is not supported.";
  }
};

async function promisifiedSetTimeout(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
