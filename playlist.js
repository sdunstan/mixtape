/*jshint esversion: 6, -W117 */

const fs = require('fs');

module.exports.parsePlaylist = function(callback) {
    'use strict';
    fs.readFile('./playlist/playlist.txt', function(err, data) {
        let songList = [];
        if (!err) {
            let fileText = data.toString('ascii');
            let lines = fileText.split(/[\n\r]/);
            lines.forEach(function(line) {
                let items = line.split('\t');
                let filePath = items[items.length-1].split(':');
                let fileName = filePath[filePath.length-1];
                if (fileName) {
                    songList.push(
                        {
                            path: fileName
                        }
                  );
                }
            });
            songList.splice(0,1); // remove header line
            callback(songList);
        }
    });
};

