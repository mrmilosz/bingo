'use strict';
document.addEventListener('DOMContentLoaded', function() {
   document.querySelector('.js-player-name').addEventListener('submit', function(event) {
      window.location.href = '/' + this.elements['player_name'].value;
      event.preventDefault();
      return false;
   });
});
