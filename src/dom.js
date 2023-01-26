const dom = {
  modeSelect: document.querySelector('.mode-select'),
  playButton: document.querySelector('#play'),
  playerOne: document.querySelector('#one'),
  playerTwo: document.querySelector('#two'),
  game: document.querySelector('.game'),
  gameboardOne: document.querySelector('#one .gameboard'),
  gameboardTwo: document.querySelector('#two .gameboard'),
  replayDiv: document.querySelector('.replay'),
  replayButton: document.querySelector('#replay'),
  shipyardOne: document.querySelector('#one .ships'),
  fiveOne: document.querySelector('#one .five'),
  fourOne: document.querySelector('#one .four'),
  threeOne: document.querySelector('#one .three'),
  twoOneOne: document.querySelectorAll('#one .two')[0],
  twoOneTwo: document.querySelector('#one .five')[1],
  start: document.querySelector('#start'),
  startImage: document.querySelector('.start-image'),
  questionMark: document.querySelector('.question-mark'),
  infoText: document.querySelector('.info-text'),
  winner: document.querySelector('.winner'),
};

export default dom;
