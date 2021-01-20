// Using .html in jQuery big NO NO: https://medium.com/@jenlindner22/the-risk-of-innerhtml-3981253fe217, switched to .text



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



