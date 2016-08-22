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

window.setInterval(function() {
    scrubber.value = audio.currentTime();    
    scrubber.max = audio.duration();
}, 1000);

let setupSong = function(songIndex) {
    let song = songList[songIndex];
    playButton.classList.add('fa-play');
    playButton.classList.remove('fa-pause');

    audio.load('playlist/' + song.path, () => {
        scrubber.max = audio.duration();
        scrubber.value = 0;
    });

    document.getElementById('title').innerText = song.tags.title;
    document.getElementById('artist').innerText = song.tags.artist;
    if (song.tags.picture) {
        document.getElementById('coverart').src = coverart.arrayToDataUrl(song.tags.picture);
    }
    else {
        document.getElementById('coverart').src = './mixtape.svg';
    }
};

document.getElementById('playButton').onclick =
  function() {
      audio.toggle();
      playButton.classList.toggle('fa-play');
      playButton.classList.toggle('fa-pause');

    // TODO: toggle scrubber anamation.
    // scrubber.max = audioElement.duration;
    // scrubber.value = audioElement.currentTime;
  };

let writeSongListToDom = function() {
    async.eachOf(songList, function(song, index, callback) {
        songListElement.insertAdjacentHTML('beforeend', `<li onclick='setupSong(${index})' id='#song${index}'><b>${song.tags.title}</b><br>${song.tags.artist}</li>`);
        callback();
    });
    setupSong(0);
};

let appendMediaTags = function(song, callback) {
    jsmediatags.read('playlist/' + song.path, {
        onSuccess: function(tag) {
            song.tags = tag.tags;
            callback();
        },
        onError: function(error) {
            callback(error);
        }
    });
};

playlist.parsePlaylist(
    function(result) {
        songList = result.slice(0);
        async.each(songList, appendMediaTags, writeSongListToDom);
    }
);
