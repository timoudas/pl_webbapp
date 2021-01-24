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