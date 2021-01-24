// Using .html in jQuery big NO NO: https://medium.com/@jenlindner22/the-risk-of-innerhtml-3981253fe217, switched to .text
// var sma = require('sma');

/**
 * JS to fill .stats-player
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

$(document).ready(function(){
    $(document).on("click", "#player-clickable-row", function() {
        const playerId = $(this).attr('value')
        $("#player-portrait").attr("src",`assets/${playerId}.png`);
        console.log(playerId)
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

                var avgMinsPlayed = []
                var totMinsPlayed = []

                for (var i = 0; i < data.length; ++i){
                    avgPassArr.push(data[i].avgPass)
                    avgShotsArr.push(data[i].avgShots)
                    avgShotsOnArr.push(data[i].averageShotsOnTarget)
                    totShotsArr.push(data[i].totalShots)
                    totPassArr.push(data[i].totalPass)
                    avgMinsPlayed.push(data[i].avgMinsPlayed)
                    totMinsPlayed.push(data[i].totalMinsPlayed)
                    passArr.push(data[i].pass)
                    shotsArr.push(data[i].shots)
                    shotsOnArr.push(data[i].shotsOnTarget)
                    labels.push(data[i].gameWeek)
                }

                var SMA3Pass = SMA(passArr, 3)
                var SMA3Shots = SMA(shotsArr, 3)
                var SMA3ShotsOn = SMA(shotsOnArr, 3)
                
                var ctx = document.getElementById('player-avg-pass').getContext('2d');
                teamProgressChart = new Chart(ctx, {
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
                                label: "SMA3Pass",
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
                var ctx = document.getElementById('player-avg-shot').getContext('2d');
                teamProgressChart = new Chart(ctx, {
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
                                label: "SMA3Shot",
                                fillColor: "rgba(0,0,0,0)",
                                strokeColor: "rgba(220,220,220,1)",
                                pointColor: "rgba(200,122,20,1)",
                                borderColor: "rgba(43, 87, 29, 0.9)",
                                fill: false,
        
                                data: SMA3Shots,
                            },
                            {
                                label: "SMA3ShotOnTarget",
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
        })
    })
})

/**
 * Collapsable Sidebar - Close
 */
$(document).on("click", ".sidenav__button", function() {
    if (($('.sidenav').css("visibility") == "visible")){
        closeNav()
    }
})

/**
 * Collabsable Sidebar - Open
 */
$(document).on("click", ".header__button", function() {
    if ($('.sidenav').css("visibility") == "hidden"){
        openNav()
    }
})

function closeNav() {
    $('.sidenav').css({'visibility': 'hidden'})
    $('.header').css({'grid-area': '1 / 1 / 2 / -1'})
    $('.main').css({'grid-area': '2 / 1 / -1 / -1'})
    $('.footer').css({'grid-area': '-2 / 1 / -1 / -1'})
  }

function openNav() {
    $('.sidenav').css({'visibility': 'visible'})
    $('.header').css({'grid-area': '1 / 2 / 2 / -1'})
    $('.main').css({'grid-area': '2 / 2 / -1 / -1'})
    $('.footer').css({'grid-area': '-2 / 2 / -1 / -1'})
  }

  /************************************************************/

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
                $('#stats-placehld').text("AvgPlayTime")
                $('#stats-placehld1').text("AvgPasses")
                $('#playerStatsAvg').empty();
                for(let i = 0; i < 50; i++) {
                    let filteredTr = newVals[i]
                    let newHtml = `<tr>
                    <td id="player-clickable-row" value=${filteredTr.id}>${filteredTr.name}</td>
                    <td>${filteredTr.teamName}</td>
                    <td>${filteredTr.position}</td>
                    <td>${filteredTr.averagePlaytime}</td>
                    <td>${filteredTr.averagePasses}</td>
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
                $('#stats-placehld').text("AvgShots")
                $('#stats-placehld1').text("AvgOnTarget")  
                $('#playerStatsAvg').empty();
                for(let i = 0; i < 50; i++) {
                    let filteredTr = newVals[i]
                    let newHtml = `<tr>
                    <td id="player-clickable-row" value=${filteredTr.id}>${filteredTr.name}</td>
                    <td>${filteredTr.teamName}</td>
                    <td>${filteredTr.position}</td>
                    <td>${filteredTr.averageShotsPerGame}</td>
                    <td>${filteredTr.averageShotsOnTarget}</td>
                    </tr>`
    
                    $('#playerStatsAvg').append(newHtml)
                }
            }
        })
    }

}



