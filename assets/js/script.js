function startPage() {
  //grab all elements
  const inputEl = document.getElementById("city-input");
  const searchEl = document.getElementById("search-button");
  const clearEl = document.getElementById("clear-history");
  const nameEl = document.getElementById("city-name");
  const currentPictureElement = document.getElementById("current-picture");
  const currentTemperatureEl = document.getElementById("temperature");
  const currentHumidityEl = document.getElementById("humidity");
  4;
  const currentWindEl = document.getElementById("wind-speed");
  const currentUVEl = document.getElementById("UV-index");
  const historyEl = document.getElementById("history");
  let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

  const APIKey = "6448d495612ed8aa879917708af54be4";
  // function to fetch data from the api
  function fetchWeather(cityName) {
    let queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&appid=" +
      APIKey;
    //data call
    axios.get(queryURL).then(function (response) {
      //date method on javascript
      const currentDate = new Date(response.data.dt * 1000);
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      nameEl.innerHTML =
        response.data.name + " (" + month + "/" + day + "/" + year + ") ";
      let weatherPic = response.data.weather[0].icon;
      currentPictureElement.setAttribute(
        "src",
        "https://openweathermap.org/img/wn/" + weatherPic + "@4x.png"
      );
      currentPictureElement.setAttribute(
        "alt",
        response.data.weather[0].description
      );
      currentTemperatureEl.innerHTML =
        "Temperature: " + k2f(response.data.main.temp) + " &#176F";
      currentHumidityEl.innerHTML =
        "Humidity: " + response.data.main.humidity + "%";
      currentWindEl.innerHTML =
        "Wind Speed: " + response.data.wind.speed + " MPH";
      let lat = response.data.coord.lat;
      let lon = response.data.coord.lon;
      let UVQueryURL =
        "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        APIKey +
        "&cnt=1";
      axios.get(UVQueryURL).then(function (response) {
        let UVIndex = document.createElement("span");
        UVIndex.setAttribute("class", "badge badge-danger");
        UVIndex.innerHTML = response.data[0].value;
        currentUVEl.innerHTML = "UV Index: ";
        currentUVEl.append(UVIndex);
      });

      let cityID = response.data.id;
      let forecastQueryURL =
        "https://api.openweathermap.org/data/2.5/forecast?id=" +
        cityID +
        "&appid=" +
        APIKey;
      // five day forecast
      axios.get(forecastQueryURL).then(function (response) {
        const forecastEls = document.querySelectorAll(".forecast");
        for (i = 0; i < forecastEls.length; i++) {
          forecastEls[i].innerHTML = "";
          const forecastIndex = i * 8 + 4;
          const forecastDate = new Date(
            response.data.list[forecastIndex].dt * 1000
          );
          const forecastDay = forecastDate.getDate();
          const forecastMonth = forecastDate.getMonth() + 1;
          const forecastYear = forecastDate.getFullYear();
          const forecastDateEl = document.createElement("p");
          forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
          forecastDateEl.innerHTML =
            forecastMonth + "/" + forecastDay + "/" + forecastYear;
          forecastEls[i].append(forecastDateEl);
          const forecastWeatherEl = document.createElement("img");
          forecastWeatherEl.setAttribute(
            "src",
            "https://openweathermap.org/img/wn/" +
              response.data.list[forecastIndex].weather[0].icon +
              "@2x.png"
          );
          forecastWeatherEl.setAttribute(
            "alt",
            response.data.list[forecastIndex].weather[0].description
          );
          forecastEls[i].append(forecastWeatherEl);
          const forecastTempEl = document.createElement("p");
          forecastTempEl.innerHTML =
            "Temp: " +
            k2f(response.data.list[forecastIndex].main.temp) +
            " &#176F";
          forecastEls[i].append(forecastTempEl);
          const forecastHumidityEl = document.createElement("p");
          forecastHumidityEl.innerHTML =
            "Humidity: " +
            response.data.list[forecastIndex].main.humidity +
            "%";
          forecastEls[i].append(forecastHumidityEl);
        }
      });
    });
  }
  //local storage
  searchEl.addEventListener("click", function () {
    const searchTerm = inputEl.value;
    fetchWeather(searchTerm);
    searchHistory.push(searchTerm);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    useSearchHistory();
  });

  clearEl.addEventListener("click", function () {
    searchHistory = [];
    useSearchHistory();
  });
  //temperature helper function
  function k2f(K) {
    return Math.floor((K - 273.15) * 1.8 + 32);
  }

  function useSearchHistory() {
    historyEl.innerHTML = "";
    for (let i = 0; i < searchHistory.length; i++) {
      const historySearch = document.createElement("input");
      historySearch.setAttribute("type", "text");
      historySearch.setAttribute("readonly", true);
      historySearch.setAttribute("class", "form-control d-block bg-white");
      historySearch.setAttribute("value", searchHistory[i]);
      historySearch.addEventListener("click", function () {
        fetchWeather(historySearch.value);
      });
      historyEl.append(historySearch);
    }
  }

  SearchHistory();
  if (searchHistory.length > 0) {
    fetchWeather(searchHistory[searchHistory.length - 1]);
  }
}
startPage();
