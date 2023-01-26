/* eslint-disable no-loop-func */
import dom from './dom';
import { gameflow } from './app';
import explosion from './assets/explosion.gif';

let eventActive = false;
let newGame = gameflow();
let active = null;
let noEventDivs = [];

function freezeClick(e) {
  if (eventActive) {
    e.stopPropagation();
    e.preventDefault();
  }
}

function getClassNameFromInteger(integer) {
  switch (integer) {
    case 5:
      return 'five';
    case 4:
      return 'four';
    case 3:
      return 'three';
    case 2:
      return 'two';
    default:
      return null;
  }
}

function resetRemaining(board) {
  const ships = board.querySelectorAll('.horizontal');
  for (let i = 0; i < ships.length; i += 1) {
    ships[i].classList.remove('sunk');
  }
}

function addShips() {
  for (let i = 1; i < 6; i += 1) {
    let copy = i;
    const newShip = document.createElement('div');
    newShip.classList.add('ship');
    if (copy < 3) {
      copy = 2;
    }
    newShip.classList.add(getClassNameFromInteger(copy));
    newShip.classList.add('horizontal');
    newShip.draggable = true;
    dom.shipyardOne.appendChild(newShip);
  }
}

function fadeOut(element) {
  element.classList.add('fade-out');
  setTimeout(() => { element.setAttribute('id', 'hidden'); }, 500);
}

function clearBoard(board) {
  while (board.hasChildNodes()) {
    board.removeChild(board.childNodes[0]);
  }
}

function fadeIn(element) {
  element.removeAttribute('id');
  element.classList.remove('fade-out');
}

function renderResult(hitCell, target, result) {
  const hitSquare = document.createElement('div');
  if (result === 'hit') {
    const explosionElement = document.createElement('img');
    explosionElement.src = explosion;
    hitCell.appendChild(explosionElement);
    setTimeout(() => {
      explosionElement.src = `${explosionElement.src.replace(/\?.*$/, '')}?x=${Math.random()}`;
      hitCell.removeChild(explosionElement);
      hitSquare.setAttribute('id', 'hit');
    }, 500);
    const shipHit = target.gameboard.getShips()[[Number.parseInt(hitCell.getAttribute('x'), 10), Number.parseInt(hitCell.getAttribute('y'), 10)]];
    if (shipHit.isSunk()) {
      const shipLength = `.${getClassNameFromInteger(shipHit.getLength())}`;
      const rShips = hitCell.parentElement.parentElement.parentElement.querySelectorAll(shipLength);
      if (rShips[0].classList.length > 2) {
        rShips[1].classList.add('sunk');
      } else {
        rShips[0].classList.add('sunk');
      }
    }
    if (newGame.isGameOver(target)) {
      fadeIn(dom.replayDiv);
      const name = (target.getName() === 'Player 1') ? 'Player 2' : 'Player 1';
      dom.winner.textContent = `${name} wins!`;
    }
  } else if (result === true) {
    hitSquare.setAttribute('id', 'miss');
  }
  hitCell.appendChild(hitSquare);
}

function botTurn() {
  const opponentHits = newGame.playerOne.gameboard.getCoordinatesHit();
  const newCoords = newGame.playerTwo.generateCoords(opponentHits);
  const botResult = newGame.playerTwo.makeHitBot(newGame.playerOne, newCoords);
  const newCoordsDiv = dom.gameboardOne.querySelector(`[x="${botResult.coordsUsed[0]}"][y="${botResult.coordsUsed[1]}"]`);
  renderResult(newCoordsDiv, newGame.playerOne, botResult.result);
  eventActive = false;
}

function clickCell(self, target) {
  if (self.getAttribute('id') === null) {
    const hitResult = target.takeHit([self.getAttribute('x'), self.getAttribute('y')]);
    if (hitResult === true || hitResult === 'hit') {
      renderResult(self, target, hitResult);
      eventActive = true;
      setTimeout(() => {
        botTurn();
      }, 350);
    }
  }
}

const boardInit = (player) => {
  const board = player.querySelector('.gameboard');
  for (let i = 1; i < 11; i += 1) {
    const newRow = document.createElement('div');
    newRow.classList.add('row');
    for (let n = 1; n < 11; n += 1) {
      const newCell = document.createElement('div');
      newCell.classList.add('cell');
      newCell.setAttribute('x', n);
      newCell.setAttribute('y', i);
      newRow.appendChild(newCell);
    }
    board.appendChild(newRow);
  }
};

function bindHit(nodeList) {
  for (let i = 0; i < nodeList.length; i += 1) {
    nodeList[i].addEventListener('click', () => {
      clickCell(nodeList[i], newGame.playerTwo);
    });
  }
}

function getIntegerFromClass(className) {
  switch (className) {
    case 'five':
      return 5;
    case 'four':
      return 4;
    case 'three':
      return 3;
    case 'two':
      return 2;
    default:
      return null;
  }
}

function applyNoEvent(cell, length, alignment) {
  const xPos = Number.parseInt(cell.getAttribute('x'), 10);
  const yPos = Number.parseInt(cell.getAttribute('y'), 10);
  if (alignment === 'horizontal') {
    for (let i = 1; i < length; i += 1) {
      const current = dom.gameboardOne.querySelector(`[x="${xPos + i}"][y="${yPos}"]`);
      current.classList.add('no-event');
    }
  } else if (alignment === 'vertical') {
    for (let i = 1; i < length; i += 1) {
      const current = dom.gameboardOne.querySelector(`[x="${xPos}"][y="${yPos + i}"]`);
      current.classList.add('no-event');
    }
  }
}

function removeNoEvent(source, length, alignment) {
  const xPos = Number.parseInt(source.getAttribute('x'), 10);
  const yPos = Number.parseInt(source.getAttribute('y'), 10);
  if (alignment === 'horizontal') {
    for (let i = 1; i < length; i += 1) {
      const current = dom.gameboardOne.querySelector(`[x="${xPos + i}"][y="${yPos}"]`);
      current.classList.remove('no-event');
    }
  } else if (alignment === 'vertical') {
    for (let i = 1; i < length; i += 1) {
      const current = dom.gameboardOne.querySelector(`[x="${xPos}"][y="${yPos + 1}"]`);
      current.classList.remove('no-event');
    }
  }
}

function removeNoEventAll() {
  const noEventsNodeList = dom.gameboardOne.querySelectorAll('.no-event');
  for (let i = 0; i < noEventsNodeList.length; i += 1) {
    noEventsNodeList[i].classList.remove('no-event');
    noEventDivs.push(noEventsNodeList[i]);
  }
}

function applyNoEventsAll() {
  for (let i = 0; i < noEventDivs.length; i += 1) {
    noEventDivs[i].classList.add('no-event');
  }
  noEventDivs = [];
}

function invalid(cell, shipLength, alignment) {
  const cellCoords = [Number.parseInt(cell.getAttribute('x'), 10), Number.parseInt(cell.getAttribute('y'), 10)];
  if (alignment === 'horizontal') {
    for (let i = 0; i < shipLength; i += 1) {
      if (cellCoords[0] + i < 11) {
        const current = dom.gameboardOne.querySelector(`[x="${cellCoords[0] + i}"][y="${cellCoords[1]}"]`);
        if (current.hasChildNodes()) {
          if (current.querySelector('.invalid') === null) {
            const invalidSquare = document.createElement('div');
            invalidSquare.classList.add('invalid');
            invalidSquare.classList.add('no-event');
            current.appendChild(invalidSquare);
          }
        }
        current.classList.add('invalid');
      }
    }
  } else if (alignment === 'vertical') {
    for (let i = 0; i < shipLength; i += 1) {
      if (cellCoords[1] + i < 11) {
        const current = dom.gameboardOne.querySelector(`[x="${cellCoords[0]}"][y="${cellCoords[1] + i}"]`);
        if (current.hasChildNodes()) {
          if (current.querySelector('.invalid') === null) {
            const invalidSquare = document.createElement('div');
            invalidSquare.classList.add('invalid');
            invalidSquare.classList.add('no-event');
            current.appendChild(invalidSquare);
          }
        }
        current.classList.add('invalid');
      }
    }
  }
}

function colorSquares(cell, shipLength, alignment, gameboard) {
  const cellCoords = [Number.parseInt(cell.getAttribute('x'), 10), Number.parseInt(cell.getAttribute('y'), 10)];
  if (alignment === 'horizontal') {
    for (let i = 0; i < shipLength; i += 1) {
      if (cellCoords[0] + i >= 11 || gameboard.getShips()[[cellCoords[0] + i, cellCoords[1]]]) {
        invalid(cell, shipLength, alignment);
        return null;
      }
      if (dom.gameboardOne.querySelector(`[x="${cellCoords[0] + i}"][y="${cellCoords[1]}"]`) !== null) {
        const current = dom.gameboardOne.querySelector(`[x="${cellCoords[0] + i}"][y="${cellCoords[1]}"]`);
        current.classList.add('hovered');
      }
    }
  } else if (alignment === 'vertical') {
    for (let i = 0; i < shipLength; i += 1) {
      if (cellCoords[1] + i >= 11 || gameboard.getShips()[[cellCoords[0], cellCoords[1] + i]]) {
        invalid(cell, shipLength, alignment);
        return null;
      }
      if (dom.gameboardOne.querySelector(`[x="${cellCoords[0]}"][y="${cellCoords[1] + i}"]`) !== null) {
        const current = dom.gameboardOne.querySelector(`[x="${cellCoords[0]}"][y="${cellCoords[1] + i}"]`);
        current.classList.add('hovered');
      }
    }
  }
  return null;
}

function removeColor(cell, shipLength, alignment) {
  const cellCoords = [Number.parseInt(cell.getAttribute('x'), 10), Number.parseInt(cell.getAttribute('y'), 10)];
  if (alignment === 'horizontal') {
    for (let i = 0; i < shipLength; i += 1) {
      if (dom.gameboardOne.querySelector(`[x="${cellCoords[0] + i}"][y="${cellCoords[1]}"]`) !== null) {
        const current = dom.gameboardOne.querySelector(`[x="${cellCoords[0] + i}"][y="${cellCoords[1]}"]`);
        if (current.querySelector('.invalid') !== null) {
          const invalidNode = current.querySelector('.invalid');
          current.removeChild(invalidNode);
        }
        current.classList.remove('hovered');
        current.classList.remove('invalid');
      }
    }
  } else if (alignment === 'vertical') {
    for (let i = 0; i < shipLength; i += 1) {
      if (dom.gameboardOne.querySelector(`[x="${cellCoords[0]}"][y="${cellCoords[1] + i}"]`) !== null) {
        const current = dom.gameboardOne.querySelector(`[x="${cellCoords[0]}"][y="${cellCoords[1] + i}"]`);
        if (current.querySelector('.invalid') !== null) {
          const invalidNode = current.querySelector('.invalid');
          current.removeChild(invalidNode);
        }
        current.classList.remove('hovered');
        current.classList.remove('invalid');
      }
    }
  }
}

function bindCopyEvents(element) {
  element.addEventListener('dragstart', (e) => {
    const num = getIntegerFromClass(element.classList[1]);
    const alignment = element.classList[2];
    active = [num, alignment, element.parentElement];
    e.dataTransfer.setData('text/plain', element.classList);
  });
  element.addEventListener('dblclick', () => {
    const alignment = element.classList[2];
    const coordinates = [Number.parseInt(element.parentElement.getAttribute('x'), 10), Number.parseInt(element.parentElement.getAttribute('y'), 10)];
    const length = getIntegerFromClass(element.classList[1]);
    if (alignment === 'vertical') {
      for (let i = 1; i < length; i += 1) {
        if (coordinates[0] + i > 10
          || newGame.playerOne.gameboard.getShips()[[coordinates[0] + i, coordinates[1]]]) {
          return null;
        }
      }
    } else if (alignment === 'horizontal') {
      for (let i = 1; i < length; i += 1) {
        if (coordinates[1] + i > 10
          || newGame.playerOne.gameboard.getShips()[[coordinates[0], coordinates[1] + i]]) {
          return null;
        }
      }
    }
    const newAlignment = alignment === 'horizontal' ? 'vertical' : 'horizontal';
    newGame.playerOne.gameboard.removeShip(length, coordinates, alignment);
    newGame.playerOne.gameboard.placeShip(length, coordinates, newAlignment);
    removeNoEvent(element.parentElement, length, alignment);
    applyNoEvent(element.parentElement, length, newAlignment);
    element.classList.remove(alignment);
    element.classList.add(newAlignment);
  });
  element.addEventListener('dragend', () => {
    applyNoEventsAll();
    active = null;
  });
}

function disablePlayerGrid() {
  const ships = dom.gameboardOne.querySelectorAll('.ship');
  for (let i = 0; i < ships.length; i += 1) {
    ships[i].classList.add('no-event');
  }
}

function bindStartEvent() {
  const allCells = dom.gameboardTwo.querySelectorAll('.cell');
  bindHit(allCells);
  disablePlayerGrid();
  newGame.playerTwo.gameboard.genBotShips();
  dom.startImage.setAttribute('id', 'disabled');
  dom.start.disabled = true;
  dom.start.classList.add('rotated');
}

function bindEvents() {
  const shipsArrayOne = dom.playerOne.querySelectorAll('.ship');
  const cellArrayOne = dom.gameboardOne.querySelectorAll('.cell');
  for (let i = 0; i < shipsArrayOne.length; i += 1) {
    shipsArrayOne[i].addEventListener('dragstart', (e) => {
      const num = getIntegerFromClass(shipsArrayOne[i].classList[1]);
      const alignment = shipsArrayOne[i].classList[2];
      active = [num, alignment, shipsArrayOne[i].parentElement];
      e.dataTransfer.setData('text/plain', shipsArrayOne[i].classList);
    });
    shipsArrayOne[i].addEventListener('dragend', () => {
      applyNoEventsAll();
      active = null;
    });
    shipsArrayOne[i].addEventListener('dblclick', () => {
      if (shipsArrayOne[i].classList[2] === 'horizontal') {
        shipsArrayOne[i].classList.remove('horizontal');
        shipsArrayOne[i].classList.add('vertical');
      } else {
        shipsArrayOne[i].classList.remove('vertical');
        shipsArrayOne[i].classList.add('horizontal');
      }
    });
  }

  for (let i = 0; i < cellArrayOne.length; i += 1) {
    cellArrayOne[i].addEventListener('dragover', (e) => {
      e.preventDefault();
      colorSquares(cellArrayOne[i], active[0], active[1], newGame.playerOne.gameboard);
    });
    cellArrayOne[i].addEventListener('dragenter', (e) => {
      e.preventDefault();
      if (cellArrayOne[i] !== active[2]) {
        removeNoEventAll();
      }
    });
    cellArrayOne[i].addEventListener('dragleave', (e) => {
      e.preventDefault();
      removeColor(cellArrayOne[i], active[0], active[1]);
    });
    cellArrayOne[i].addEventListener('drop', (e) => {
      e.preventDefault();
      removeColor(cellArrayOne[i], active[0], active[1]);
      const xPos = Number.parseInt(cellArrayOne[i].getAttribute('x'), 10);
      const yPos = Number.parseInt(cellArrayOne[i].getAttribute('y'), 10);
      if (newGame.playerOne.gameboard.placeShip(active[0], [xPos, yPos], active[1])) {
        const sourceCoords = [Number.parseInt(active[2].getAttribute('x'), 10), Number.parseInt(active[2].getAttribute('y'), 10)];
        if (newGame.playerOne.gameboard.getShips()[sourceCoords]) {
          newGame.playerOne.gameboard.removeShip(active[0], sourceCoords, active[1]);
        }
        const shipCopy = document.createElement('div');
        const shipData = e.dataTransfer.getData('text/plain').split(' ');
        shipCopy.classList.add(shipData[0]);
        shipCopy.classList.add(shipData[1]);
        shipCopy.classList.add(shipData[2]);
        shipCopy.setAttribute('id', 'placed');
        shipCopy.setAttribute('draggable', true);
        bindCopyEvents(shipCopy);
        cellArrayOne[i].appendChild(shipCopy);
        const elementToRemoveFromList = active[2].querySelector(`.${shipData[1]}`);
        if (elementToRemoveFromList !== null) {
          applyNoEventsAll();
          active[2].removeChild(elementToRemoveFromList);
          if (active[2] !== dom.shipyardOne) {
            removeNoEvent(active[2], active[0], active[1]);
          }
        }
        if (dom.shipyardOne.children.length === 0) {
          // dom.shipyardOne.classList.add('fade-out');
          dom.start.disabled = false;
          dom.startImage.setAttribute('id', 'enabled');
          dom.start.addEventListener('click', bindStartEvent);
        }
        applyNoEvent(cellArrayOne[i], active[0], active[1]);
      }
      active = null;
    });
  }
  document.addEventListener('click', freezeClick, true);
}

function reset() {
  clearBoard(dom.gameboardOne);
  clearBoard(dom.gameboardTwo);
  resetRemaining(dom.playerOne);
  resetRemaining(dom.playerTwo);
  addShips();
  dom.shipyardOne.classList.remove('fade-out');
  dom.start.classList.remove('rotated');
  const temp = gameflow();
  newGame = temp;
}

function bindOnce() {
  dom.replayButton.addEventListener('click', () => {
    fadeOut(dom.replayDiv);
    reset();
    boardInit(dom.playerOne);
    boardInit(dom.playerTwo);
    bindEvents();
  });
  dom.questionMark.addEventListener('click', () => {
    if (dom.infoText.getAttribute('id') !== 'active') {
      dom.infoText.setAttribute('id', 'active');
    } else {
      dom.infoText.removeAttribute('id');
    }
  });
}

boardInit(dom.playerOne);
boardInit(dom.playerTwo);
bindEvents();
bindOnce();
