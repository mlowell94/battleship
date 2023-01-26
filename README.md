# Battleship

A version of the game Battleship that can be played in the browser, themed after the Gameboy Advance game Advance Wars and built entirely with plain Javascript (built in September 2022).
This project was built using test-driven design practices.


## How-to

Drag the ships in the solid blue area onto the board (ships can be rotated by double clicking on them). Once all ships have been placed, press the start 
button and select a space on the opponent's board to make a move. If you hit a ship, the space will become blue, otherwise it will become red. Sink all of the 
opponent's ships before they sink your own in order to win.

### Features

* Drag-and-drop API to place ships
* Active feedback on whether or not a space is available to place a ship
* Intelligent computer player that checks spaces around successful hit in order to make informed plays

### Challenges

* Writing tests in order to dictate expectations
* Ensuring computer player's move stack functions as intended

### Notable Takeaways

* Learned how to use Jest
* Learned how to bundle assets with webpack
* Learned how to make custom configurations with webpack