'use strict';
document.addEventListener('DOMContentLoaded', function() {
   var socket = io.connect('ws://:8003');

   socket.on('response', function(data) {
      document.querySelector('.js-board').innerHTML = '<table>' + data.map(function(row, index) {
         var result = '';
         if (index % 5 === 0) {
            result += '<tr>';
         }

         result += '<td>' + row.value + '</td>';

         if (index % 5 === 4) {
            result += '</tr>';
         }

         return result;
      }).join('') + '</table>';
   });

   socket.emit('request', { seed: location.pathname.substr(1) });
});
