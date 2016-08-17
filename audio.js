/*jshint esversion: 6, -W117 */

const fs = require('fs');

// TODO: get rid of this state
module.exports = (function() {
    'use strict';
    let deckA, playingA = false, context, bufferA, offsetA;

    return {
        isPlayingA: () => { return playingA; },
        loadA: (fileName, deckConnected) => {
            if (playingA) {
                this.pauseA();
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
                    this.durationA = bufferA.duration;
                    if (deckConnected)
                        deckConnected();
                });
            });
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
                if (playingA)
                    this.pauseA();
                else
                    this.playA();
            }
        }
    };
}());
