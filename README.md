# WurdGame Server

## APP Overview

Wurdgame is a 2 player word game using Socket.io. The game begins when two players join. They will each then be sent a set of random letters. Each player will then create the longest word that they can with the letters and send them back to the hub. The hub will then calculate the players' words and let them know which player won.

## Deployed URL

- [Wurd]()

## Hub Responsibilties

-  This hub is the main game server.

- will send letters to players once there are 2

- receives letters and compares scores

- Hub will compare received words to known words with a dictionary library

- sends results to players

## Tools

- Socket.io

- uuid

- jest

- express

- axios

## Installation

- run `git clone https://github.com/wurdgame/hub.git`

- `cd wordgame/hub`

- `npm install`

## Usage

- to start: `npm start`

## UML

![UML](https://github.com/wurdgame/hub/issues/2#issue-1118732612)

## Team Members

- Erik Savage

- Ryan Lee

- Spencer Tower

- Michael Hendricks
