'use strict';
document.addEventListener('DOMContentLoaded', function() {
   var socket = io.connect('ws://:8003');

   socket.on('call', function(data) {
      Array.prototype.forEach.call(document.querySelectorAll('.cell[data-term_id="' + data.term_id + '"]'), function(cellElement) {
         cellElement.classList.add('called');
      });
   });

   Array.prototype.forEach.call(document.querySelectorAll('.cell'), function(cellElement) {
      cellElement.addEventListener('click', function() {
         socket.emit('call', { term_id: this.getAttribute('data-term_id') });
      });
   });
});
