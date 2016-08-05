var jsmediatags = require('jsmediatags');
var audioElement = document.getElementById("deck"),
  scrubber = document.getElementById("scrubber"),
  songListElement = document.getElementById("songListElement");

var play = function() {
  audioElement.play();
  playButton.classList.remove("fa-play");
  playButton.classList.add("fa-pause");
};

var pause = function() {
  audioElement.pause();
  playButton.classList.remove("fa-pause");
  playButton.classList.add("fa-play");
};

var playSong = function(path) {
  setupSong({path:path});
}

var setupSong = function(song) {
  pause();
  scrubber.max = 100;
  scrubber.value = 0;

  deck.src = "playlist/" + song.path;
  // play();

  jsmediatags.read("playlist/" + song.path, {
    onSuccess: function(tag) {
      // console.log(tag);
      document.getElementById("title").innerText = tag.tags.title;
      document.getElementById("artist").innerText = tag.tags.artist;
      if (tag.tags.picture) {
        document.getElementById("coverart").src = imageLoader.arrayToDataUrl(tag.tags.picture);
      }
    },
    onError: function(error) {
      console.log(error);
    }
  });
};

document.getElementById("playButton").onclick =
  function() {
    var playButton = document.getElementById("playButton");

    if (audioElement.paused === true) {
      play();
    }
    else {
      pause();
    }
    scrubber.max = audioElement.duration;
    scrubber.value = audioElement.currentTime;
  };

audioElement.addEventListener('timeupdate', function() {
  scrubber.value = audioElement.currentTime;
});

playlist.parsePlaylist(
    function(songList) {
      setupSong(songList[0]);
      songList.forEach(function(song, index) {
        jsmediatags.read("playlist/" + song.path, {
          onSuccess: function(tag) {
            songListElement.insertAdjacentHTML('beforeend', `<li onclick='playSong("${song.path}")' id='#song${index}'><b>${tag.tags.title}</b><br>${tag.tags.artist}</li>`);
          },
          onError: function(error) {
            console.log(error);
          }
        });
      });
    }
);
