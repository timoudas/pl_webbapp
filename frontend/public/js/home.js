// Using .html in jQuery big NO NO: https://medium.com/@jenlindner22/the-risk-of-innerhtml-3981253fe217, switched to .text
// var sma = require('sma');

/**
 * Simple Moving Average function
 */
var SMA = function(valueArr, points){
    var targetArr = []
    for (var i = 0; i < valueArr.length; i++){
        var mean = +((valueArr[i] + valueArr[i-1] + valueArr[i+1])/3.0).toFixed(1);
        if (!isNaN(mean)){
            targetArr.push(mean);
        }else{
            targetArr.push(valueArr[i])
        }     
    }
    return targetArr
}
/********************************************************* */

/**
 * Function to get player list for a specific team
 */
$(document).ready(function(){
    $(document).on("change", "#hteam", function(){
        const teamId = $('#hteam option:selected').val()
        $.ajax({
            type: 'POST',
            url: `/probTeam/${teamId}?` + $.param({ teamId: teamId}), 
            success: (data) => {
                $('#hplayer').empty()
                for (var i=0; i<data.length; ++i){
                    playersHTML = `<option value="${data[i].playerId}">${data[i].playerName}</option>`
                    $('#hplayer').append(playersHTML)
                }       
            }
        })
    })
})

/********************************************************* */
// Chart variables
var shotChart
var passChart
var tackleChart
/**
 * Function to trigger charts for a player
 */
$(document).ready(function(){
    $(document).on("click", "#player-clickable-row", function() {
        const playerId = $(this).attr('value')
        $("#player-portrait").attr("src",`assets/${playerId}.png`);
        $.ajax({
            type: 'POST',
            url: `/${playerId}?` + $.param({ playerId: playerId}),
            success: (data) => {   

                var playerInfo = data[0]
                $('.player-info').empty()
                $('.player-name').text(`${playerInfo.Name}`)
                $('.player-name').attr("value", (`${playerInfo.id}`))
                playerInfoHTML = 
                `<div class="p-hinfo-field">Club</div>
                <div class="p-info-field" value=${playerInfo.teamId}>${playerInfo.Club}</div>
                <div class="p-hinfo-field">Position</div>
                <div class="p-info-field">${playerInfo.PositionInfo}</div>
                <div class="p-hinfo-field">Appearances</div>
                <div class="p-info-field">${playerInfo.Appearances}</div>
                <div class="p-hinfo-field">Country</div>
                <div class="p-info-field">${playerInfo.Country}</div>`
                $('.player-info').append(playerInfoHTML)

                

                var labels = []

                var avgPassArr = []
                var totPassArr = []
                var passArr = []

                var avgShotsArr = []
                var avgShotsOnArr = []
                var totShotsArr = []
                var shotsArr = []
                var shotsOnArr = []

                var tackleArr = []
                var avgTackleArr = []


                var avgMinsPlayed = []
                var totMinsPlayed = []

                for (var i = 0; i < data.length; ++i){
                    avgPassArr.push(data[i].avgPass)
                    totPassArr.push(data[i].totalPass)
                    passArr.push(data[i].pass)

                    avgShotsArr.push(data[i].avgShots)
                    avgShotsOnArr.push(data[i].averageShotsOnTarget)
                    totShotsArr.push(data[i].totalShots)
                    shotsArr.push(data[i].shots)
                    shotsOnArr.push(data[i].shotsOnTarget)
                    
                    avgMinsPlayed.push(data[i].avgMinsPlayed)
                    totMinsPlayed.push(data[i].totalMinsPlayed)
                    
                    tackleArr.push(data[i].tackle)
                    avgTackleArr.push(data[i].avgTackles)

                    labels.push(data[i].gameWeek)
                }

                var SMA3Pass = SMA(passArr, 3)
                var SMA3Shots = SMA(shotsArr, 3)
                var SMA3ShotsOn = SMA(shotsOnArr, 3)
                var SMA3Tackles = SMA(tackleArr, 3)

                if (passChart) {
                    passChart.data.labels = labels
                    passChart.data.datasets[0].data = avgPassArr
                    passChart.data.datasets[1].data = SMA3Pass
                    passChart.update()
                } else {
                    var ctx = document.getElementById('player-avg-pass').getContext('2d');
                    passChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: [
                                {
                                    label: "avgPass",
                                    fillColor: "rgba(172, 26, 26, 0.9)",
                                    strokeColor: "rgba(172, 26, 26, 0.9)",
                                    pointColor: "rgba(172, 26, 26, 0.9)",
                                    borderColor: "rgba(14, 86, 168, 0.9)",   
                                    fill: false,
            
                                    data: avgPassArr,
                                },
                                {
                                    label: "MA3Pass",
                                    fillColor: "rgba(0,0,0,0)",
                                    strokeColor: "rgba(220,220,220,1)",
                                    pointColor: "rgba(200,122,20,1)",
                                    borderColor: "rgba(43, 87, 29, 0.9)",
                                    fill: false,
            
                                    data: SMA3Pass,
                                },
                            ]
                        }
                    })
                }
                if (tackleChart) {
                    tackleChart.data.labels = labels
                    tackleChart.data.datasets[0].data = avgTackleArr
                    tackleChart.data.datasets[1].data = SMA3Tackles
                    tackleChart.update()
                } else {
                    var ctx = document.getElementById('player-avg-tackle').getContext('2d');
                    tackleChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: [
                                {
                                    label: "avgTackle",
                                    fillColor: "rgba(172, 26, 26, 0.9)",
                                    strokeColor: "rgba(172, 26, 26, 0.9)",
                                    pointColor: "rgba(172, 26, 26, 0.9)",
                                    borderColor: "rgba(14, 86, 168, 0.9)",   
                                    fill: false,
            
                                    data: avgTackleArr,
                                },
                                {
                                    label: "MA3Tackles",
                                    fillColor: "rgba(0,0,0,0)",
                                    strokeColor: "rgba(220,220,220,1)",
                                    pointColor: "rgba(200,122,20,1)",
                                    borderColor: "rgba(43, 87, 29, 0.9)",
                                    fill: false,
            
                                    data: SMA3Tackles,
                                },
                            ]
                        }
                    })
                }
                if (shotChart) {
                    shotChart.data.labels = labels
                    shotChart.data.datasets[0].data = avgShotsArr
                    shotChart.data.datasets[1].data = SMA3Shots
                    shotChart.data.datasets[2].data = SMA3ShotsOn
                    shotChart.update()
                } else {
                    var ctx = document.getElementById('player-avg-shot').getContext('2d');
                    shotChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: [
                                {
                                    label: "avgShot",
                                    fillColor: "rgba(172, 26, 26, 0.9)",
                                    strokeColor: "rgba(172, 26, 26, 0.9)",
                                    pointColor: "rgba(172, 26, 26, 0.9)",
                                    borderColor: "rgba(14, 86, 168, 0.9)",   
                                    fill: false,
            
                                    data: avgShotsArr,
                                },
                                {
                                    label: "MA3Shot",
                                    fillColor: "rgba(0,0,0,0)",
                                    strokeColor: "rgba(220,220,220,1)",
                                    pointColor: "rgba(200,122,20,1)",
                                    borderColor: "rgba(43, 87, 29, 0.9)",
                                    fill: false,
            
                                    data: SMA3Shots,
                                },
                                {
                                    label: "MA3OnTarget",
                                    fillColor: "rgba(0,0,0,0)",
                                    strokeColor: "rgba(220,220,220,1)",
                                    pointColor: "rgba(200,122,20,1)",
                                    borderColor: "rgba(197, 202, 8, 0.9)",
                                    fill: false,
            
                                    data: SMA3ShotsOn,
                                },
                            ]
                        },
                        options: {
                            yAxes: [{
                                ticks: {
                                    min: 0,
                                    suggestedMax: 8,
                                    stepSize: 1,
                                }
                            }]
                        }
                    })
                }
            }
        })
    })
})



/**
 * Click eventlistner for home-page player stats
 */
const homeTable = document.querySelectorAll(".stats-item");
homeTable.forEach(element => {
    element.addEventListener('click', homeTableToggle)
})
function homeTableToggle(event){
    var queryVal = event.target.value
    if (queryVal == 1){
        $.ajax({
            type: 'POST',
            url: '/?' + $.param({ statsType: queryVal}),
            success: (newVals) => {   
                $('#stats-fouls').css({'display':'none'})
                $('#stats-placehld').text("AvgPlayTime")
                $('#stats-placehld1').text("AvgPasses")
                $('#playerStatsAvg').empty();
                for(let i = 0; i < newVals.length; i++) {
                    let filteredTr = newVals[i]
                    let newHtml = `<tr>
                    <td id="player-clickable-row" value=${filteredTr.id}>${filteredTr.name}</td>
                    <td>${filteredTr.teamName}</td>
                    <td>${filteredTr.position}</td>
                    <td>${filteredTr.averagePlaytime}</td>
                    <td data-std="${filteredTr.stdDevPasses}">${filteredTr.averagePasses}</td>
                    </tr>`
    
                    $('#playerStatsAvg').append(newHtml)
                }
            }
        })
    } else if (queryVal == 2){
        $.ajax({
            type: 'POST',
            url: '/?' + $.param({ statsType: queryVal}),
            success: (newVals) => {     
                $('#stats-fouls').css({'display':'none'})
                $('#stats-placehld').text("AvgShots")
                $('#stats-placehld1').text("AvgOnTarget")  
                $('#playerStatsAvg').empty();
                for(let i = 0; i < newVals.length; i++) {
                    let filteredTr = newVals[i]
                    let newHtml = `<tr>
                    <td id="player-clickable-row" value="${filteredTr.id}">${filteredTr.name}</td>
                    <td>${filteredTr.teamName}</td>
                    <td>${filteredTr.position}</td>
                    <td data-std="${filteredTr.stdDevShots}">${filteredTr.averageShotsPerGame}</td>
                    <td data-std="${filteredTr.stdDevShotsOnTarget}">${filteredTr.averageShotsOnTarget}</td>
                    </tr>`
    
                    $('#playerStatsAvg').append(newHtml)
                }
            }
        })
    } else if (queryVal == 3){
        $.ajax({
            type: 'POST',
            url: '/?' + $.param({ statsType: queryVal}),
            success: (newVals) => {     
                $('#stats-fouls').css({'display':'block'})
                $('#stats-placehld').text("AvgTackle")
                $('#stats-placehld1').text("AvgWonTackle")  
                $('#playerStatsAvg').empty();
                for(let i = 0; i < newVals.length; i++) {
                    let filteredTr = newVals[i]
                    let newHtml = `<tr>
                    <td id="player-clickable-row" value=${filteredTr.id}>${filteredTr.name}</td>
                    <td>${filteredTr.teamName}</td>
                    <td>${filteredTr.position}</td>
                    <td>${filteredTr.avgFoul}</td>
                    <td data-std="${filteredTr.stdDevTackle}">${filteredTr.avgTackle}</td>
                    <td>${filteredTr.avgWonTackle}</td>
                    </tr>`
    
                    $('#playerStatsAvg').append(newHtml)
                }
            }
        })
    }

}



