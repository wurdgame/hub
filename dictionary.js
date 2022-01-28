'use strict';

// this will be for the REST Get method to https://api.dictionaryapi.dev/api/v2/entries/en/<word>
const axios = require('axios');


async function validWord(word) {
  try {
    let result = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

    console.log('TRYCONSOLELOG: ', result);
    console.log(result.data[0].word); //if valid word, returns the word


    if (result) {
      console.log('true');
      return true;
    } else {
      console.log('false');
      return false;
    }
  } catch (err) {
    console.error(err.data);

  }
}

let valid = validWord('wurd');
// let valid = validWord('test');
console.log(valid);
// console.log(validWord('test'));


module.exports = validWord;