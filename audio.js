// TODO: refactor to pure functions. Take all this state out of here.
var audio = (function() {
  var deckA, deckB, playingA = false, context, bufferA, offsetA;
  return {
    isPlayingA: function() { return playingA; },
    loadA: function(fileName, deckConnected) {
      if (playingA) {
        audio.pauseA();
      }
      deckA = null;
      if (context) {
        context.close();
        context = null;
        bufferA = null;
      }
      offsetA = 0.0;
      context = new AudioContext();
      fs.readFile(fileName, (err, fileData) => {
        context.decodeAudioData(fileData.buffer, (audioBuffer) => {
          bufferA = audioBuffer;
          var deck = context.createBufferSource();
          deck.buffer = bufferA;
          deck.connect(context.destination);
          deckA = deck;
          durationA = bufferA.duration;
          deckConnected && deckConnected();
        });
      });
    },
    durationA: function() {
      return durationA;
    },
    currentTimeA: function() {
      return context.currentTime;
    },
    playA: function() {
      if (deckA && !playingA) {
        playingA = true;
        deckA.start(0, offsetA);
      }
    },
    pauseA: function() {
      if (deckA || playingA) {
        offsetA = context.currentTime;
        playingA = false;
        deckA.stop();
        deckA = null;

        var deck = context.createBufferSource();
        deck.buffer = bufferA;
        deck.connect(context.destination);
        deckA = deck;
      }
    },
    toggleA: function() {
      if (deckA) {
        if (playingA) {
          audio.pauseA();
        }
        else {
          audio.playA();
        }
      }
    }
  }
}());
