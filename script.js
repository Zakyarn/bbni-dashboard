// script.js

let chart;

let allData = [];

async function loadCSV(){

    const response =
        await fetch('data.csv');

    const data =
        await response.text();

    const rows =
        data.trim().split('\n').slice(1);

    rows.forEach(row => {

        const cols = row.split(',');

        allData.push({

            date: cols[0],

            open: parseFloat(cols[1]),

            high: parseFloat(cols[2]),

            low: parseFloat(cols[3]),

            close: parseFloat(cols[4]),

            volume: parseFloat(cols[5])

        });

    });

    const latest =
        allData[allData.length - 1];

    document.getElementById('open').innerText =
        latest.open.toFixed(2);

    document.getElementById('high').innerText =
        latest.high.toFixed(2);

    document.getElementById('low').innerText =
        latest.low.toFixed(2);

    document.getElementById('close').innerText =
        latest.close.toFixed(2);

    document.getElementById('volume').innerText =
        latest.volume;

    document.getElementById('currentPrice').innerText =
        latest.close.toFixed(2);

    createChart(allData);

}

function createChart(data){

    const labels =
        data.map(item => item.date);

    const actualPrices =
        data.map(item => item.close);

    const lowPrices =
        data.map(item => item.low);

    const predictionPrices =
        actualPrices.map(price =>
            price + (Math.random() * 60 - 30)
        );

    const ctx =
        document.getElementById('stockChart');

    if(chart){

        chart.destroy();
    }

    chart = new Chart(ctx, {

        type:'line',

        data:{

            labels:labels,

            datasets:[

                {

                    label:'Actual Price',

                    data:actualPrices,

                    borderColor:'#22c55e',

                    borderWidth:3,

                    tension:0.3,

                    fill:false
                },

                {

                    label:'Low Price',

                    data:lowPrices,

                    borderColor:'#ef4444',

                    borderWidth:3,

                    tension:0.3,

                    fill:false
                },

                {

                    label:'Prediction Price',

                    data:predictionPrices,

                    borderColor:'#3b82f6',

                    borderWidth:3,

                    tension:0.3,

                    borderDash:[5,5],

                    fill:false
                }

            ]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            interaction:{

                mode:'index',

                intersect:false
            },

            plugins:{

                tooltip:{

                    titleFont:{
                        size:22
                    },

                    bodyFont:{
                        size:20
                    },

                    padding:15
                },

                legend:{

                    labels:{

                        color:'white',

                        font:{
                            size:18
                        }
                    }
                }

            },

            scales:{

                x:{

                    ticks:{

                        color:'white',

                        maxTicksLimit:10,

                        font:{
                            size:14
                        }
                    },

                    grid:{

                        color:'rgba(255,255,255,0.05)'
                    }

                },

                y:{

                    ticks:{

                        color:'white',

                        font:{
                            size:14
                        }
                    },

                    grid:{

                        color:'rgba(255,255,255,0.05)'
                    }

                }

            }

        }

    });

}

function filterByDate(){

    const startDate =
        document.getElementById('startDate').value;

    const endDate =
        document.getElementById('endDate').value;

    const interval =
        document.getElementById('intervalSelect').value;

    let filtered =
        allData.filter(item => {

            const itemDate =
                new Date(item.date);

            return itemDate >= new Date(startDate)
                &&
                   itemDate <= new Date(endDate);

        });

    if(interval === 'weekly'){

        filtered =
            filtered.filter((_, index) =>
                index % 5 === 0
            );

    }else if(interval === 'monthly'){

        filtered =
            filtered.filter((_, index) =>
                index % 20 === 0
            );

    }

    createChart(filtered);

}

/* FLATPICKR */

flatpickr("#startDate", {

    dateFormat: "Y-m-d",

    defaultDate: "2019-01-01"
});

flatpickr("#endDate", {

    dateFormat: "Y-m-d",

    defaultDate: "2024-12-31"
});

loadCSV();
