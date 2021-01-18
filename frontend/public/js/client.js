// Using .html in jQuery big NO NO: https://medium.com/@jenlindner22/the-risk-of-innerhtml-3981253fe217, switched to .text

/**
 * Stick SidePanel in /table
 */
const firstdiv = $(".team-prog-info");
var secondiv = $(".team-form");
var thirdiv = $(".team-latest-fix");
const fheight = firstdiv.outerHeight(true);
const sheight = secondiv.outerHeight(true);
console.log(fheight)
console.log(sheight)
console.log(secondiv)
secondiv.css({ top: `${fheight}px`})
thirdiv.css({top: `${fheight+sheight}px`})


// Chart Variables
var teamProgressChart

// Get initial value from filters in /table
var seasonSelection = $('#seasonToggle').children(":first").val()
var typeSelection = $('#homeAwayToggle').children(":first").val()
var MatchweekSelection = $('#homeAwayToggle').children(":first").val()
// var leagueTableUpdateTimeStamp = 0

function teamLatestFixtures(fixtures, div){
    $(div).empty()
    for (var i = 0; i < 5; i++){
        var teamFixHTML =
        `<div class="team-fixture value="${fixtures[i].fId}">
            <div class="team-home" value=${fixtures[i].homeTeamId}>${fixtures[i].homeTeam}</div>
            <div class="teams-score__home">${fixtures[i].homeTeamScore}</div>
            <div class="teams-score__away">${fixtures[i].awayTeamScore}</div>
            <div class="team-away" value=${fixtures[i].homeTeamId}>${fixtures[i].awayTeam}</div>
        </div>`    
        $(div).append(teamFixHTML)
    }
    /* TODO: ADD STYLE */
}


/**
 * 
 * @param {Array} teamForm | Values that indicate W / F / D
 * @param {HTML} div | Target element
 * Function to create win/draw/loss div
 */
function teamFormDiv(teamForm, div){
    $(div).empty()
    for (var i = 0; i < 5; i++){
        var teamFormHtml
        switch(teamForm.form[i]){
            case 'W':
                teamFormHtml = `<div class='team-form-cont' id="team-win">${teamForm.form[i]}</div>`  
                break
            case 'D':
                teamFormHtml = `<div class='team-form-cont' id="team-draw">${teamForm.form[i]}</div>` 
                break
            case 'L':
                teamFormHtml = `<div class='team-form-cont' id="team-loss">${teamForm.form[i]}</div>` 
                break
        }
        console.log('done')
        $(div).append(teamFormHtml)
    }
}

/**
 * Team progress chart update in /table
 */
$(document).on("click", ".clickable-row", function() {
    const teamVal = $(this).attr('value')
    $.ajax({
        type: 'POST',
        url: '/table/team?' + $.param({ teamId: teamVal }),
        success: (res) => {
            var teamLastesGames = res.teamGameData
            var teamForm = res.teamFormData[0]
            var result = res.teamProgData[0]
            var points = result.pointsAll
            var position = result.positionAll
            var labels = result.gameweeks
            var team = result.teamName
            teamFormDiv(teamForm, ".team-form")
            teamLatestFixtures(teamLastesGames, ".team-latest-fix")
            // TODO: FIX FOR LOOP TO APPEND ELEMENTS
            if (teamProgressChart) {
                teamProgressChart.data.labels = labels
                teamProgressChart.data.datasets[0].data = points
                teamProgressChart.data.datasets[1].data = position
                teamProgressChart.options.title.text = team
                teamProgressChart.update()
            } else {
                    var ctx = document.getElementById('team-progress-graph').getContext('2d');
                    Chart.defaults.global.defaultFontSize = 16;
                    teamProgressChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: [
                                {
                                    label: "Points",
                                    fillColor: "rgba(0,0,0,0)",
                                    strokeColor: "rgba(220,220,220,1)",
                                    pointColor: "rgba(200,122,20,1)",
                                    borderColor: "rgba(43, 87, 29, 0.9)",
                                    fill: false,
            
                                    data: points,
                                    yAxisID: 'points'
                                },
                                {
                                    label: "Position",
                                    fillColor: "rgba(172, 26, 26, 0.9)",
                                    strokeColor: "rgba(172, 26, 26, 0.9)",
                                    pointColor: "rgba(172, 26, 26, 0.9)",
                                    borderColor: "rgba(14, 86, 168, 0.9)",   
                                    fill: false,
            
                                    data: position,
                                    yAxisID: 'position'
                                },
                            ],
                        },
                        options: {
                            title: {
                                display: true,
                                text: team
                            },
                            scales: {
                                xAxes: [
                                    {
                                        ticks: {
                                            // fontSize: 24,
                                            autoSkip: false,
                                            beginAtZero: true
                                        }
                                }
                                ],
                                yAxes: [
                                    {
                                        id: 'points',
                                        min: 0,
                                        position: 'left',
                                        ticks: {
                                            // fontSize: 24,
                                            beginAtZero: true
                                        }
                                    },
                                    {
                                        id: 'position',
                                        suggestedMin : 0,
                                        suggestedMax : 20,
                                        position: 'right', 
                                        // ticks: {
                                        //     fontSize: 24
                                        // }
                                    },
                                    
                                ]
                            },
                            display: false,
                        },
                    })
                }
        }
    })
})
              



/**
 * Button to updata data in /table
 */
$('#updateDataButton').bind('click', function(event){
    console.log(event.timeStamp)
    $.ajax({
        type: 'POST',
        url: '/table',
        success: () => {
            console.log('success')
            window.location = "/";
        }
        
    })
});

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
                    <td>${filteredTr.name}</td>
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
                    <td>${filteredTr.name}</td>
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


//Click eventlistner for all table-filters
$(document).ready(function() {
    const selection = document.querySelectorAll(".dropdown-item");
    selection.forEach(element => {
    element.addEventListener('click', pickSelection)
    })
})


function pickSelection(event) {
    let text = ""
    switch(event.target.parentElement.id){
        case 'seasonToggle':
            text = event.target.textContent
            $('#seasonvalue').text(text)
            seasonSelection =  event.target.value
            break
        case 'homeAwayToggle':
            text = event.target.textContent
            $('#typevalue').text(text)
            typeSelection =  event.target.value
            break
        case 'matchWeekToggle':
            text = event.target.textContent
            $('#matchDropDownMenyButton').text(text)
            MatchweekSelection =  event.target.value
            break
    }
    //Get request for
    $.ajax({
        type: 'POST',
        url: '/table?' + $.param({ seasonVal: seasonSelection, 
                                typeVal: typeSelection,
                                matchWeekVal: MatchweekSelection}),
        success: (filteredSeasonValues) => {          
            $('#league-table-rows').empty();
            for(let i = 0; i < 20; i++) {
                let filteredTr = filteredSeasonValues[i]
                let newHtml = 
                `<tr id="pos-id-${i+1}">
                    <td>${i+1}</td>
                    <td class="clickable-row" value="${filteredTr.team_id}"> 
                        <img src='badges/${filteredTr.team_shortName}.png'/>
                        ${filteredTr.team_shortName}
                    </td>
                    <td>${filteredTr.played}</td>
                    <td>${filteredTr.won}</td>
                    <td>${filteredTr.drawn}</td>
                    <td>${filteredTr.lost}</td>
                    <td>${filteredTr.goalsFor}</td>
                    <td>${filteredTr.goalsAgainst}</td>
                    <td>${filteredTr.goalsDifference}</td>
                    <td>${filteredTr.points}</td>
                </tr>`

                $('#league-table-rows').append(newHtml)
            }
        }
    })
}
