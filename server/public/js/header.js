initReactive()

function initReactive() {
  $('.lang-select.header-dropdown').click(function(e) {
    var _this = $(e.currentTarget)
    if (_this.hasClass('active')) {
      _this.removeClass('active')
    } else {
      _this.addClass('active')
    }
  })

  $('.lang-select.side-menu-dropdown p').click(function (e) {
    var _this = $(e.currentTarget).parent()
    if (_this.hasClass('active')) {
      _this.removeClass('active')
    } else {
      _this.addClass('active')
    }
  })

  $('.fa.fa-bars.burger-icon').click(function(e) {
    var _this = $('#side-menu')
    if (_this.hasClass('active')) {
      _this.removeClass('active')
    } else {
      _this.addClass('active')
    }
  })
}