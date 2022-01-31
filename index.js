'use strict';

//requirements:
const uuid = require('uuid').v4;
const socketio = require('socket.io');
const randomWords = require('random-words');
const randomString = require('randomstring');


const PORT = process.env.PORT || 3000;
const server = socketio(PORT);
const wurd = server.of('/wurd');

const validWord = require('./dictionary');

const queue = {
  submissions: {},
  playerCount: 0,
  playAgainCount: 0,
  addSubmission: function (payload) {
    // function to add submissions to queue
    // adds id: word pair
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
    // socket.join(clientId);
    // wurd.emit('join', clientId);
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

  socket.on('disconnect', () => {
    queue.playerCount -= 1;
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
        console.log(`You Tied`);  
      } else {
        console.log(`${winner} WINS with ${word}!`);
      }

      queue.removeSubmissions();
      console.log('SUBMISSIONS', queue.submissions);
      wurd.emit('playagain');
    }  
  });
      // check how many valid words, sort by length if multiple are valid
    //   if (validWords.length === 0) {
    //     payload = 'You\'re all wrong';
    //   } else if (validWords.length === 1) {
    //     payload = `The winner is player ${validWords[0][0]} with the word ${validWords[0][1]}`; // display id and winning word
    //   } else {
    //     // determine winner by sorting wurd lengths if only 2 users
    //     payload = checkWurdLength(validWords);
    //   }
    // }
    // //validate for each word send check via dictionaryAPI, if valid, longest length wins, if same length, tie.
    // wurd.emit('winner', payload);
  // });

  function readyCheck() {
    console.log('made it into readyCHeck function');
    if (queue.playerCount >= 2) {
      let payload = new Wurd;
      wurd.emit('gamestart', payload);
    } else {
      socket.emit('gamestatus', 'Waiting for additional player');
    }
  }

  // check wurd lengths to determin winner if only 2 players
  function checkWurdLength(arr) {
    console.log('Valid Word Array: ', arr);
    let winner;

    if (arr[0][1] > arr[1][1].length) {
      winner = `The winner is ${arr[0][0]}!`; // winner userName
    } else if (arr[0][1].length < arr[1][3].length) {
      winner = `The winner is ${arr[1][3]}!`; // winner userName
    } else {
      winner = 'It\'s a draw!';
    }
    console.log('Winner: ', winner);
    return winner;
  }
});




// function sortWurdLengths(arr) {
//   let sortedWords = arr.sort((a, b) => {
//     return a.wurd.length - b.wurd.length;  // double check
//   });
//   let winners = [];
//   // we know the first word is winner
//   winners.push(sortedWords[0].id);
//   // check for other winners
//   // start checking at second word
//   for (let i = 1; i < sortedWords.length; i += 1) {
//     if (sortedWords[i][1].length === sortedWords[0][1].length) {
//       winners.push(sortedWords[i][0]);
//     }
//   }
//   return winners; // right now just returns list of winner ids





