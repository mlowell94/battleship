/* eslint-disable no-lonely-if */
function QueueNode(data, next = null) {
  this.data = data;
  this.next = next;
}

function Queue(head = null, tail = null) {
  this.head = head;
  this.tail = tail;
  this.enqueue = (data) => {
    const newNode = new QueueNode(data);
    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
  };
  this.dequeue = () => {
    this.head = this.head.next;
  };
}

const shipFactory = (length) => {
  const shipLength = length;
  let hits = 0;
  let sunk = false;
  const isSunk = () => {
    if (hits === shipLength) {
      sunk = true;
    }
    return sunk;
  };
  const hit = () => {
    hits += 1;
    return isSunk();
  };
  const getLength = () => shipLength;
  return { hit, isSunk, getLength };
};

const gameboardFactory = () => {
  const coordinatesHit = {};
  const shipPositions = {};
  let totalShips = 5;
  const placeShip = (length, coordinates, alignment) => {
    // creates a new ship object that will be placed on the board (if all coordinates are valid).
    const newShip = shipFactory(length);
    // initializes an array to hold coordinates
    const tempArray = [];
    // if the alignment is vertical...
    if (alignment === 'vertical') {
      // if the chosen coordinate/length combination would result
      // in part of the piece existing outside of the board...
      if ((coordinates[1] + length - 1) > 10) {
        // return false (exiting the function and preventing invalid values from entering the board)
        return false;
      }
      // if the above is not true...
      // run a for loop until i equals the length (e.g. length of 4 runs 4 times)
      for (let i = 0; i !== length; i += 1) {
        // if the position would result in overlap...
        if (shipPositions[[coordinates[0], coordinates[1] + i]]) {
          // return false
          return false;
        }
        // if the above is not true, push the coordinates to the array
        tempArray.push([[coordinates[0], coordinates[1] + i]]);
      }
      // the below code does the same thing but for horizontal alignments
    } else if (alignment === 'horizontal') {
      if ((coordinates[0] + length - 1) > 10) {
        return false;
      }
      for (let i = 0; i !== length; i += 1) {
        if (shipPositions[[coordinates[0] + i, coordinates[1]]]) {
          return false;
        }
        tempArray.push([[coordinates[0] + i, coordinates[1]]]);
      }
    }
    // if the above loops have finished successfully, plug tempArray's values
    // into the shipPositions object, with each key pointing to the corresponding ship
    // object.
    for (let i = 0; i !== tempArray.length; i += 1) {
      shipPositions[tempArray[i]] = newShip;
    }
    // finally, return true
    return true;
  };

  const removeShip = (length, coordinates, alignment) => {
    const tempArray = [];
    if (alignment === 'horizontal') {
      for (let i = 0; i !== length; i += 1) {
        tempArray.push([[coordinates[0] + i, coordinates[1]]]);
      }
    } else if (alignment === 'vertical') {
      for (let i = 0; i !== length; i += 1) {
        tempArray.push([[coordinates[0], coordinates[1] + i]]);
      }
    }
    for (let i = 0; i !== tempArray.length; i += 1) {
      delete shipPositions[tempArray[i]];
    }
  };
  const receiveAttack = (coordinates) => {
    // check if the coordinates are valid
    if ((coordinates[0] > 10 || coordinates[0] < 1)
      || (coordinates[1] > 10 || coordinates[1] < 1)) {
      return false;
    }
    // if the coordinates have not yet been hit...
    if (!coordinatesHit[[coordinates[0], coordinates[1]]]) {
      // add the coordinates as a key to the object
      // containing hit coordinates, and set its value to true.
      coordinatesHit[[coordinates[0], coordinates[1]]] = true;
      // and if the coordinates correspond to the position of a ship...
      if (shipPositions[[coordinates[0], coordinates[1]]]) {
        // add 1 to the ship's hit counter...
        shipPositions[[coordinates[0], coordinates[1]]].hit();
        // then check if that ship has sunk.
        if (shipPositions[[coordinates[0], coordinates[1]]].isSunk()) {
          // if the ship has sunk, lower the total number of ships on the gameboard by 1.
          totalShips -= 1;
        }
        return 'hit';
      }
      // if the coordinates do not contain a ship, add the coordinates
      // to the object containing hit coordinates, and set its value to true.
      coordinatesHit[[coordinates[0], coordinates[1]]] = true;
    } else {
      // if the coordinates have already been hit, return false.
      return false;
    }
    return true;
  };

  const genBotShips = () => {
    let counter = 1;
    while (counter !== 6) {
      const alignment = Math.floor(Math.random() * 2) === 0 ? 'horizontal' : 'vertical';
      const xPos = Math.floor(Math.random() * 10) + 1;
      const yPos = Math.floor(Math.random() * 10) + 1;
      let length = null;
      switch (counter) {
        case 1:
          length = 2;
          break;
        case 2:
          length = 2;
          break;
        case 3:
          length = 3;
          break;
        case 4:
          length = 4;
          break;
        case 5:
          length = 5;
          break;
        default:
          break;
      }
      if (placeShip(length, [xPos, yPos], alignment)) {
        counter += 1;
      }
    }
  };
    // the below two functions are used for testing purposes
  const getShips = () => shipPositions;
  const getCoordinatesHit = () => coordinatesHit;
  const getTotal = () => totalShips;

  return {
    placeShip, receiveAttack, getShips, getCoordinatesHit, getTotal, removeShip, genBotShips,
  };
};

const playerFactory = (name = 'Player 1') => {
  const playerName = name;
  const gameboard = gameboardFactory();
  const takeHit = (coordinates) => gameboard.receiveAttack(coordinates);
  const generateCoords = (hitList) => {
    let firstCoord = Math.floor(Math.random() * 10) + 1;
    let secondCoord = Math.floor(Math.random() * 10) + 1;
    while (hitList[[firstCoord, secondCoord]] !== undefined) {
      firstCoord += 1;
      if (firstCoord > 10) {
        firstCoord = 1;
        secondCoord += 1;
        if (secondCoord > 10) {
          firstCoord = 1;
          secondCoord = 1;
        }
      }
    }
    return [firstCoord, secondCoord];
  };
  const getName = () => playerName;

  const isDefeated = () => (gameboard.getTotal() === 0);

  const hitQueue = new Queue();
  const makeHitBot = (opponent, coords) => {
    const opponentHits = opponent.gameboard.getCoordinatesHit();
    if (hitQueue.head === null) {
      const hitStatus = opponent.takeHit(coords);
      if (hitStatus === 'hit') {
        hitQueue.enqueue(coords);
        return { result: 'hit', coordsUsed: coords };
      }
      return { result: true, coordsUsed: coords };
    }
    // if the hitQueue isn't empty...
    if (hitQueue.head.data[0] - 1 > 0 // left
        && opponentHits[[hitQueue.head.data[0] - 1, hitQueue.head.data[1]]] === undefined) {
      if (opponent.takeHit([hitQueue.head.data[0] - 1, hitQueue.head.data[1]]) === 'hit') {
        hitQueue.enqueue([hitQueue.head.data[0] - 1, hitQueue.head.data[1]]);
        return { result: 'hit', coordsUsed: [hitQueue.head.data[0] - 1, hitQueue.head.data[1]] };
      }
      return { result: true, coordsUsed: [hitQueue.head.data[0] - 1, hitQueue.head.data[1]] };
    } if ((hitQueue.head.data[1] - 1 > 0 // up
        && opponentHits[[hitQueue.head.data[0], hitQueue.head.data[1] - 1]] === undefined)) {
      if (opponent.takeHit([hitQueue.head.data[0], hitQueue.head.data[1] - 1]) === 'hit') {
        hitQueue.enqueue([hitQueue.head.data[0], hitQueue.head.data[1] - 1]);
        return { result: 'hit', coordsUsed: [hitQueue.head.data[0], hitQueue.head.data[1] - 1] };
      }
      return { result: true, coordsUsed: [hitQueue.head.data[0], hitQueue.head.data[1] - 1] };
    } if (hitQueue.head.data[0] + 1 < 11 // right
      && opponentHits[[hitQueue.head.data[0] + 1, hitQueue.head.data[1]]] === undefined) {
      if (opponent.takeHit([hitQueue.head.data[0] + 1, hitQueue.head.data[1]]) === 'hit') {
        hitQueue.enqueue([hitQueue.head.data[0] + 1, hitQueue.head.data[1]]);
        return { result: 'hit', coordsUsed: [hitQueue.head.data[0] + 1, hitQueue.head.data[1]] };
      }
      return { result: true, coordsUsed: [hitQueue.head.data[0] + 1, hitQueue.head.data[1]] };
    } if (hitQueue.head.data[1] + 1 < 11 // down
        && opponentHits[[hitQueue.head.data[0], hitQueue.head.data[1] + 1]] === undefined) {
      if (opponent.takeHit([hitQueue.head.data[0], hitQueue.head.data[1] + 1]) === 'hit') {
        hitQueue.enqueue([hitQueue.head.data[0], hitQueue.head.data[1] + 1]);
        const temp = [hitQueue.head.data[0], hitQueue.head.data[1] + 1];
        hitQueue.dequeue();
        return { result: 'hit', coordsUsed: temp };
      }
      const temp = [hitQueue.head.data[0], hitQueue.head.data[1] + 1];
      hitQueue.dequeue();
      return { result: true, coordsUsed: temp };
    }
    hitQueue.dequeue();
    return makeHitBot(opponent, coords);
  };
  return {
    makeHitBot,
    takeHit,
    isDefeated,
    generateCoords,
    gameboard,
    getName,
  };
};

const gameflow = () => {
  const playerOne = playerFactory();
  const playerTwo = playerFactory('Player 2');

  const isGameOver = (target) => {
    if (target.gameboard.getTotal() === 0) {
      return true;
    }
    return false;
  };
  return {
    playerOne, playerTwo, isGameOver,
  };
};

export {
  shipFactory, playerFactory, gameboardFactory, gameflow,
};
