// script.js

let chart;
let allData = [];

async function loadCSV() {

    try {

        const dataResponse = await fetch("data.csv");
        const dataText = await dataResponse.text();

        const predictionResponse =
            await fetch("hasil_prediksi_bbni.csv");

        const predictionText =
            await predictionResponse.text();

        const rows =
            dataText.trim().split(/\r?\n/).slice(1);

        const predictionRows =
            predictionText.trim().split(/\r?\n/).slice(1);

        allData = [];

        rows.forEach(row => {

            const cols = row.split(",");

            allData.push({

                date: cols[0],
                open: parseFloat(cols[1]),
                high: parseFloat(cols[2]),
                low: parseFloat(cols[3]),
                close: parseFloat(cols[4]),
                volume: parseFloat(cols[5]),
                prediction: null

            });

        });

        const predictions = predictionRows.map(row => {

            const cols = row.split(",");

            return parseFloat(cols[3]);

        });

        const testingStart =
            allData.length - predictions.length;

        predictions.forEach((prediction, index) => {

            allData[testingStart + index].prediction =
                prediction;

        });

        filterByDate();

    } catch (error) {

        alert("Failed to load CSV data");

        console.error(error);

    }

}

function createChart(data) {

    const labels =
        data.map(item => item.date);

    const actualPrices =
        data.map(item => item.close);

    const lowPrices =
        data.map(item => item.low);

    const predictionPrices =
        data.map(item => item.prediction);

    const ctx =
        document.getElementById("stockChart");

    if (chart) {

        chart.destroy();

    }

    chart = new Chart(ctx, {

        type: "line",

        data: {

            labels: labels,

            datasets: [

                {

                    label: "Actual Price",
                    data: actualPrices,
                    borderColor: "#22c55e",
                    borderWidth: 3,
                    tension: 0.3,
                    fill: false

                },

                {

                    label: "Low Price",
                    data: lowPrices,
                    borderColor: "#ef4444",
                    borderWidth: 3,
                    tension: 0.3,
                    fill: false

                },

                {

                    label: "Prediction Price",
                    data: predictionPrices,
                    borderColor: "#3b82f6",
                    borderDash: [5, 5],
                    borderWidth: 3,
                    tension: 0.3,
                    fill: false,
                    spanGaps: false

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            interaction: {

                mode: "index",
                intersect: false

            },

            plugins: {

                tooltip: {

                    displayColors: true,

                    titleFont: {

                        size: 13

                    },

                    bodyFont: {

                        size: 12

                    },

                    padding: 12

                },

                legend: {

                    labels: {

                        color: "white",

                        font: {

                            size: 12

                        }

                    }

                }

            },

            scales: {

                x: {

                    ticks: {

                        color: "white",
                        maxTicksLimit: 8,

                        font: {

                            size: 12

                        }

                    },

                    grid: {

                        color: "rgba(255,255,255,.05)"

                    }

                },

                y: {

                    beginAtZero: false,

                    ticks: {

                        color: "white",

                        font: {

                            size: 12

                        }

                    },

                    grid: {

                        color: "rgba(255,255,255,.05)"

                    }

                }

            }

        }

    });

}

function filterByDate() {

    const startDate =
        document.getElementById("startDate").value;

    const endDate =
        document.getElementById("endDate").value;

    if (new Date(startDate) > new Date(endDate)) {

        alert("Start Date cannot be later than End Date.");

        return;

    }

    const interval =
        document.getElementById("intervalSelect").value;

    let filtered = allData.filter(item => {

        const itemDate = new Date(item.date);

        return itemDate >= new Date(startDate) &&
               itemDate <= new Date(endDate);

    });

    if (filtered.length === 0) {

        alert("No data available for the selected date range.");

        if (chart) {

            chart.destroy();

        }

        return;

    }

    if (interval === "weekly") {

        filtered =
            filtered.filter((_, index) => index % 5 === 0);

    }

    else if (interval === "monthly") {

        filtered =
            filtered.filter((_, index) => index % 20 === 0);

    }

    createChart(filtered);

    const latest =
        filtered[filtered.length - 1];

    document.getElementById("open").innerText =
        latest.open.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    document.getElementById("high").innerText =
        latest.high.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    document.getElementById("low").innerText =
        latest.low.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    document.getElementById("close").innerText =
        latest.close.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    document.getElementById("volume").innerText =
        latest.volume.toLocaleString("en-US");

    document.getElementById("currentPrice").innerText =
        latest.close.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    if (filtered.length > 1) {

        const previous =
            filtered[filtered.length - 2];

        const change =
            latest.close - previous.close;

        const percent =
            (change / previous.close) * 100;

        const priceChange =
            document.getElementById("priceChange");

        priceChange.innerText =
            `${change >= 0 ? "+" : ""}${change.toFixed(2)} (${percent.toFixed(2)}%)`;

        priceChange.style.color =
            change >= 0 ? "#22c55e" : "#ef4444";

    }

}

flatpickr("#startDate", {

    dateFormat: "Y-m-d",
    minDate: "2019-01-01",
    maxDate: "2025-12-31",
    defaultDate: "2019-01-01",
    disableMobile: true,
    clickOpens: true

});

flatpickr("#endDate", {

    dateFormat: "Y-m-d",
    minDate: "2019-01-01",
    maxDate: "2025-12-31",
    defaultDate: "2025-12-31",
    disableMobile: true,
    clickOpens: true

});

loadCSV();
