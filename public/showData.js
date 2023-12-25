import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  limitToLast,
  query,
  orderByKey,
  remove,
  update,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCibkj2xAWjEk5jyxoWYr_yUP6qkiaU_lE",
    authDomain: "esp8266direct.firebaseapp.com",
    databaseURL: "https://esp8266direct-default-rtdb.firebaseio.com",
    projectId: "esp8266direct",
    storageBucket: "esp8266direct.appspot.com",
    messagingSenderId: "1058064689395",
    appId: "1:1058064689395:web:8ab7e9841dc6c4d2d16f86"
   
  };

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  const sensorRefs = {
    jsonArray: ref(database, "json001"),

  };


const lastTenEventsQueryj = query(sensorRefs.jsonArray, orderByKey(), limitToLast(100));

let temperatureChart;
let humidityChart;
let mqChart;

const graphTemperatureData = (data, labels) => {
  const ctx = document.getElementById('temperatureChart').getContext('2d');
  if (temperatureChart) {
    temperatureChart.destroy();
    console.log("destroyed");
  }
  temperatureChart = new Chart(ctx, {

    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Temperature Events",
        data: data,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      }],
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: "Index",
          },
        },
        y: {
          title: {
            display: true,
            text: "Value",
          },
        },
      },
    },
  });
};

const graphHumidityData = (data, labels) => {
  const ctx = document.getElementById('humidityChart').getContext('2d');
  if (humidityChart) {
    humidityChart.destroy();
  }
  humidityChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Humidity Events",
        data: data,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      }],
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: "Index",
          },
        },
        y: {
          title: {
            display: true,
            text: "Value",
          },
        },
      },
    },
  });
};

const graphMQData = (data, labels) => {
  const ctx = document.getElementById('mqChart').getContext('2d');
  if (mqChart) {
    mqChart.destroy();
  }
  mqChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Air Quality Events",
        data: data,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      }],
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: "Index",
          },
        },
        y: {
          title: {
            display: true,
            text: "Value",
          },
        },
      },
    },
  });
};

function eraseData (){

  remove(ref(database, 'json001'))
    .then(() => {
        console.log("Borrado exitoso.");
    })
    .catch((error) => {
        console.log("Borrado fallido: " + error.message);
    });

};

const clearDataButton = document.getElementById("erase-data-button");
clearDataButton.addEventListener("click", () => {
  eraseData()
 
});


onValue(lastTenEventsQueryj, (snapshot) => {
  let data = snapshot.val();
  if (!Array.isArray(data)) {
    data = Object.values(data);
  }
  const temperatureData = data.map(item => item.Temperatura).slice(-60);
  const humidityData = data.map(item => item.Humedad).slice(-60);
  const mqData = data.map(item => item.MQ).slice(-60);
  const timeEpoch = data.map(item => item.ts).slice(-60);

  // Convertir el tiempo Epoch a fecha y hora humanamente legibles
  const timeLabels = timeEpoch.map(epoch => {
    const date = new Date(epoch);
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  });

  graphTemperatureData(temperatureData, timeLabels);
  graphHumidityData(humidityData, timeLabels);
  graphMQData(mqData, timeLabels);
});




