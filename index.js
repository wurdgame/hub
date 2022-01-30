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

function letters() {
  let randWord = randomWords({ exactly: 1, maxLength: 8 });
  console.log(randWord);
}

const queue = {
  submissions: {},
  addSubmission: function (payload) {
    // function to add submissions to queue
    // adds id: word pair
    this.submissions.payload.id = payload.word; // placeholder
    console.log(this.submissions.payload);
  },
  removeSubmission: function (id) {
    //function to remove submissions once the round winner has been determined

  },
};

// Wurd allows us to make a new object to send to emit to the players
class Wurd {
  constructor() {
    this.roundId = uuid();
    this.letters = randomString.generate({
      length: 8,
      charset: `${randomWords({ exactly: 1, maxLength: 8 })}`,
    });
  }
}

let test = new Wurd;
console.log(test);

server.on('connection', (socket) => {

  // create room
  socket.on('join', clientId => {
    socket.join(clientId);
    wurd.emit('join', clientId);
  });

  socket.on('newround', payload => {
    payload = new Wurd;
    wurd.emit('newround', payload);

  });

  // receive new word back from client
  socket.on('submit', payload => {

    //do something with the submissions so we can determine the winner
    // need queue to keep track of submissions
    queue.addSubmission(payload); // add payload to queue
    //check if the number of submissions in the queue match the number of players, if so, determine a winner
    if (Object.keys(queue).length === 'number of users in wurd room') {
      // determine winner via api
    }
    //validate for each word send check via dictionaryAPI, if valid, longest length wins, if same length, tie.
    wurd.emit('winner', payload);
  });

});