
/**
 * JS to fill .stats-player
 */
$(document).on("click", "#player-clickable-row", function() {
    const parentDiv = $(".player-stats")
    const imgDiv = $(".player-img")
    const playerId = $(this).attr('value')
    getPlayerImg(playerId)
})

function getPlayerImg(playerId){
    const imgDiv = $(".player-img")
    imgDiv.empty();
    const imgSource = `/assets/${playerId}`
    var imgHTML = `<img src=${imgSource}.png onerror="this.onerror=null;this.src='assets/Photo-Missing.png'";/>`
    imgDiv.append(imgHTML);
}

function getPlayerInfo(playerId){
    /* TODO: CREATE HTML */
}