/*jshint esversion: 6, -W117 */
const playlist = require('./playlist');
const async = require('async');
const audio = require('./audio.js');
const coverart = require('./coverart.js');

let songList = [];

const jsmediatags = require('jsmediatags');
const scrubber = document.getElementById('scrubber'),
    songListElement = document.getElementById('songListElement'),
    playButton = document.getElementById('playButton');

let setupSong = function(song) {
    scrubber.max = 100;
    scrubber.value = 0;

    playButton.classList.add('fa-play');
    playButton.classList.remove('fa-pause');

    audio.loadA('playlist/' + song);

    jsmediatags.read('playlist/' + song, {
        onSuccess: function(tag) {
            // console.log(tag);
            document.getElementById('title').innerText = tag.tags.title;
            document.getElementById('artist').innerText = tag.tags.artist;
            if (tag.tags.picture) {
                document.getElementById('coverart').src = coverart.arrayToDataUrl(tag.tags.picture);
            }
        },
        onError: function(error) {
            console.log(error);
        }
    });
};

document.getElementById('playButton').onclick =
  function() {
      audio.toggleA();
      playButton.classList.toggle('fa-play');
      playButton.classList.toggle('fa-pause');

    // TODO: toggle scrubber anamation.
    // scrubber.max = audioElement.duration;
    // scrubber.value = audioElement.currentTime;
  };

let writeSongListToDom = function() {
    async.eachOf(songList, function(song, index, callback) {
        songListElement.insertAdjacentHTML('beforeend', `<li onclick='setupSong("${song.path}")' id='#song${index}'><b>${song.tags.title}</b><br>${song.tags.artist}</li>`);
        callback();
    });
};

let appendMediaTags = function(song, callback) {
    console.log('About to try to read ' + song.path);
    jsmediatags.read('playlist/' + song.path, {
        onSuccess: function(tag) {
            song.tags = tag.tags;
            callback();
        },
        onError: function(error) {
            console.log(error);
            callback(error);
        }
    });
};

playlist.parsePlaylist(
    function(result) {
        songList = result.slice(0);
        setupSong(songList[0].path); // move to end
        async.each(songList, appendMediaTags, writeSongListToDom);
    }
);
