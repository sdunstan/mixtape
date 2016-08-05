var fs = require('fs');

var playlist = (function() {
  return {
    parsePlaylist: function(callback) {
      fs.readFile('./playlist/playlist.txt', function(err, data) {
        var songList = [];
        if (!err) {
          var fileText = data.toString("ascii");
          var lines = fileText.split(/[\n\r]/);
          lines.forEach(function(line) {
              var items = line.split("\t");
              var filePath = items[items.length-1].split(":");
              songList.push(
                {
                  path: filePath[filePath.length-1]
                }
              )
          });
          songList.splice(0,1); // remove header line
          callback(songList);
        }
      });
    }
  }
}());
