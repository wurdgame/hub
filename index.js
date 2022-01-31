'use strict';

//requirements:
const uuid = require('uuid').v4;
const socketio = require('socket.io');
const randomWords = require('random-words');
const randomString = require('randomstring');


const PORT = process.env.PORT || 3000;
const server = socketio(PORT);
const wurd = server.of('/wurd');

//this would be to use dictionary API to validate word
// const validWord = require('./dictionary');

const queue = {
  submissions: {},
  playerCount: 0,
  playAgainCount: 0,
  addSubmission: function (payload) {
    // function to add submissions to queue
    this.submissions[payload.userName] = payload; // placeholder
    // console.log(this.submissions.payload);
  },
  removeSubmissions: function () {
    //function to remove submissions once the round winner has been determined
    this.submissions = {}; // clear all submissions
  },
};

// Wurd allows us to make a new object to send to emit to the players
class Wurd {
  constructor() {
    this.roundId = uuid();
    this.letters = randomString.generate({
      length: 12,
      charset: `${randomWords({ exactly: 3, maxLength: 4, join: '' })}`,
    });
  }
}

wurd.on('connection', (socket) => {
  // create room
  socket.on('join', player => {
    console.log(player.name);
    console.log(`${player.name} has joined`);
    queue.playerCount += 1; // increase player count when new players join
    console.log('playercount', queue.playerCount);
    readyCheck();
  });

  socket.on('newround', payload => {
    console.log(`${payload.name} wants to play again`);
    queue.playAgainCount += 1;

    if (queue.playAgainCount === 2) {
      payload = new Wurd;
      wurd.emit('gamestart', payload);
      queue.playAgainCount = 0;
    }
  });

  socket.on('disconnect', (player) => {
    queue.playerCount -= 1;
    console.log(player);
    console.log('someone disconnected');
    wurd.emit('gamestatus', 'Player 2 Disconnected, Waiting for Additional Player');
  });

  // receive new word back from client
  socket.on('submit', payload => {
    console.log('WE ARE SUBMITTING');
    //do something with the submissions so we can determine the winner
    // need queue to keep track of submissions
    queue.addSubmission(payload); // add payload to queue
    console.log(queue.submissions);
    //check if the number of submissions in the queue match the number of players, if so, determine a winner
    if (Object.keys(queue.submissions).length === queue.playerCount) {
      // let validWords = []; // track valid words
      // iterate through each submission and check if word is valid
      let winner;
      let longest = 0;
      let word;
      let result;
      Object.keys(queue.submissions).forEach((key) => {
        let answer = queue.submissions[key].answer;
        let currentPlayer = queue.submissions[key].userName;

        if (answer.length > longest) {
          longest = answer.length;
          winner = currentPlayer;
          word = answer;
        } else if (answer.length === longest) {
          winner = 'TIED';
        }

      });
      if (winner === 'TIED') {
        result = `You Tied`;  
      } else {
        result = `${winner} WINS with ${word}!`;
      }
      console.log(result);
      queue.removeSubmissions();
      console.log('SUBMISSIONS', queue.submissions);
      wurd.emit('playagain', result);
    }  
  });

  function readyCheck() {
    console.log('made it into readyCHeck function');
    if (queue.playerCount >= 2) {
      let payload = new Wurd;
      wurd.emit('gamestart', payload);
    } else {
      socket.emit('gamestatus', 'Waiting for additional player');
    }
  }
});





