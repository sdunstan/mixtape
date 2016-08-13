var jsmediatags = require('jsmediatags');
var scrubber = document.getElementById("scrubber"),
  songListElement = document.getElementById("songListElement");

var setupSong = function(song) {
  scrubber.max = 100;
  scrubber.value = 0;
  playButton.classList.add("fa-play");
  playButton.classList.remove("fa-pause");

  audio.loadA("playlist/" + song);

  jsmediatags.read("playlist/" + song, {
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

    audio.toggleA();
    playButton.classList.toggle("fa-play");
    playButton.classList.toggle("fa-pause");

    // TODO: toggle scrubber anamation.
    // scrubber.max = audioElement.duration;
    // scrubber.value = audioElement.currentTime;
  };

playlist.parsePlaylist(
    function(songList) {
      setupSong(songList[0].path);
      songList.forEach(function(song, index) {
        jsmediatags.read("playlist/" + song.path, {
          onSuccess: function(tag) {
            songListElement.insertAdjacentHTML('beforeend', `<li onclick='setupSong("${song.path}")' id='#song${index}'><b>${tag.tags.title}</b><br>${tag.tags.artist}</li>`);
          },
          onError: function(error) {
            console.log(error);
          }
        });
      });
    }
);
