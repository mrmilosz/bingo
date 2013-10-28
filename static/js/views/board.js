'use strict';
document.addEventListener('DOMContentLoaded', function() {
   var socket = io.connect('ws://:8003');
   socket.on('connect', function() {
      var roomName = document.querySelector('.board').getAttribute('data-game_name');
      socket.emit('join', {
         roomName: roomName
      });

      socket.on('call', function(data) {
         /*
          * In English:
          * - Whenever another player calls this cell's term, increment this cell's hint count
          * - Whenever another player uncalls this cell's term, decrement this cell's hint count with minimum zero
          * - Whenever this cell's hint count is changed, if it is not zero mark this cell as 'hinted' using a CSS class
          *   - Otherwise unmark this cell
          */
         Array.prototype.forEach.call(document.querySelectorAll('.cell[data-term_id="' + data.term_id + '"]'), function(cellElement) {
            var hintCount = Math.max((parseInt(cellElement.getAttribute('data-hint_count')) || 0) + data.direction, 0);
            cellElement.setAttribute('data-hint_count', hintCount);
            if (hintCount > 0) {
               cellElement.classList.add('hinted');
            }
            else {
               cellElement.classList.remove('hinted');
            }
         });
      });

      /*
       * In English:
       * - Broadcast all calls and uncalls of this cell to the other players
       * - Whenever this player calls this cell, mark this cell as 'called' using a CSS class
       *   - Whenever this player uncalls this cell, unmark it
       */
      Array.prototype.forEach.call(document.querySelectorAll('.cell'), function(cellElement) {
         cellElement.addEventListener('click', function() {
            socket.emit('call', {
               term_id: cellElement.getAttribute('data-term_id'),
               direction: cellElement.classList.toggle('called') ? 1 : -1
            });
         });
      });
   });
});
