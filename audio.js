/*jshint esversion: 6, -W117 */

const fs = require('fs');

function Audio() {
    'use strict';
    let deck, playing = false, context, buffer, offset, startTime;

    this.isPlaying = () => { return playing; };

    this.load = (fileName, deckConnected) => {
        if (playing) {
            this.pause();
        }

        deck = null;

        if (context) {
            context.close();
            context = null;
            buffer = null;
        }

        offset = 0.0;
        startTime = 0.0;
        context = new AudioContext();
        fs.readFile(fileName, (err, fileData) => {
            context.decodeAudioData(fileData.buffer, (audioBuffer) => {
                buffer = audioBuffer;
                var aDeck = context.createBufferSource();
                aDeck.buffer = buffer;
                aDeck.connect(context.destination);
                deck = aDeck;
                if (deckConnected)
                    deckConnected();
            });
        });
    };

    this.currentTime = function() {
        if (playing)
            return context.currentTime - startTime;
        else
            return offset;
    };

    this.duration = function() {
        if (buffer) {
            return buffer.duration;
        }
        else {
            return 100.0;
        }
    };

    this.play = function() {
        if (deck && !playing) {
            playing = true;
            deck.start(0, offset);
            offset = context.currentTime;
            startTime = offset;
        }
    };

    this.pause = function() {
        if (deck && playing) {
            offset = context.currentTime;
            playing = false;
            deck.stop();
            deck = null;

            var tempDeck = context.createBufferSource();
            tempDeck.buffer = buffer;
            tempDeck.connect(context.destination);
            deck = tempDeck;
        }
    };

    this.toggle = function() {
        if (deck) {
            if (playing)
                this.pause();
            else
                this.play();
        }
    };
}

module.exports = new Audio();