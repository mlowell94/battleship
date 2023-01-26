/* eslint-disable jest/no-disabled-tests */
import { shipFactory, gameboardFactory, playerFactory } from './src/app';

it('adds hits to ship object and checks for whether or not it is sunk', () => {
  const myShip = shipFactory(4);
  expect(myShip.hit()).toBe(false);
  expect(myShip.hit()).toBe(false);
  expect(myShip.hit()).toBe(false);
  expect(myShip.hit()).toBe(true);
});

it('places ships vertically', () => {
  const myGameboard = gameboardFactory();
  myGameboard.placeShip(4, [1, 1], 'vertical');
  expect(Object.keys(myGameboard.getShips())).toStrictEqual(['1,1', '1,2', '1,3', '1,4']);
});

it('places ships horizontally', () => {
  const myGameboard = gameboardFactory();
  myGameboard.placeShip(4, [1, 1], 'horizontal');
  expect(Object.keys(myGameboard.getShips())).toStrictEqual(['1,1', '2,1', '3,1', '4,1']);
});

it('returns false when a ship is placed outside of the gameboard', () => {
  const myGameboard = gameboardFactory();
  expect(myGameboard.placeShip(4, [9, 1], 'horizontal')).toBe(false);
  expect(myGameboard.placeShip(4, [1, 9], 'vertical')).toBe(false);
  expect(myGameboard.placeShip(4, [1, 7], 'vertical')).toBe(true);
  expect(myGameboard.placeShip(4, [7, 1], 'horizontal')).toBe(true);
});

it('prevents ships from overlapping', () => {
  const myGameboard = gameboardFactory();
  expect(myGameboard.placeShip(4, [1, 10], 'horizontal')).toBe(true);
  expect(myGameboard.placeShip(4, [4, 7], 'vertical')).toBe(false);
});

it('returns undefined when coordinates are not in table', () => {
  const myGameboard = gameboardFactory();
  myGameboard.placeShip(4, [1, 1], 'horizontal');
  expect(myGameboard.getShips()['2,2']).toBe(undefined);
});

it('receives hits at specified coordinates and adds them to table', () => {
  const myGameboard = gameboardFactory();
  myGameboard.placeShip(4, [1, 1], 'vertical');
  myGameboard.receiveAttack([1, 1]);
  myGameboard.receiveAttack([1, 2]);
  myGameboard.receiveAttack([1, 3]);
  myGameboard.receiveAttack([1, 5]);
  expect(Object.keys(myGameboard.getCoordinatesHit())).toStrictEqual(['1,1', '1,2', '1,3', '1,5']);
});

it('prevents previously hit locations from being updated', () => {
  const myGameboard = gameboardFactory();
  myGameboard.placeShip(4, [1, 1], 'vertical');
  expect(myGameboard.receiveAttack([1, 1])).toBe('hit');
  expect(myGameboard.receiveAttack([1, 1])).toBe(false);
});

it('returns the current number of ships remaining', () => {
  const myGameboard = gameboardFactory();
  myGameboard.placeShip(4, [1, 1], 'vertical');
  expect(myGameboard.receiveAttack([1, 1])).toBe('hit');
  expect(myGameboard.receiveAttack([1, 2])).toBe('hit');
  expect(myGameboard.receiveAttack([1, 3])).toBe('hit');
  expect(myGameboard.receiveAttack([1, 4])).toBe('hit');
});

it('returns false on invalid coordinate input', () => {
  const myGameboard = gameboardFactory();
  myGameboard.placeShip(4, [1, 1], 'vertical');
  expect(myGameboard.receiveAttack([11, 1])).toBe(false);
  expect(myGameboard.receiveAttack([1, 11])).toBe(false);
  expect(myGameboard.receiveAttack([-1, 1])).toBe(false);
  expect(myGameboard.receiveAttack([1, -1])).toBe(false);
});

it('coordinatesHit contains keys whose values are true, unspecified are undefined', () => {
  const myGameboard = gameboardFactory();
  myGameboard.placeShip(4, [1, 1], 'vertical');
  myGameboard.receiveAttack([1, 1]);
  myGameboard.receiveAttack([1, 2]);
  myGameboard.receiveAttack([1, 3]);
  myGameboard.receiveAttack([1, 5]);
  expect(myGameboard.getCoordinatesHit()[[1, 1]]).toBe(true);
  expect(myGameboard.getCoordinatesHit()[[1, 2]]).toBe(true);
  expect(myGameboard.getCoordinatesHit()[[1, 3]]).toBe(true);
  expect(myGameboard.getCoordinatesHit()[[1, 5]]).toBe(true);
  expect(myGameboard.getCoordinatesHit()[[1, 6]]).toBe(undefined);
});

it('returns "hit" on a hit', () => {
  const myGameboard = gameboardFactory();
  myGameboard.placeShip(4, [1, 1], 'vertical');
  expect(myGameboard.receiveAttack([1, 1])).toBe('hit');
});

it('returns false if coords not valid (already hit, outside bounds)', () => {
  const myGameboard = gameboardFactory();
  myGameboard.placeShip(4, [1, 1], 'vertical');
  expect(myGameboard.receiveAttack([1, 1])).toBe('hit');
  expect(myGameboard.receiveAttack([1, 1])).toBe(false);
  myGameboard.receiveAttack([1, 9]);
  expect(myGameboard.receiveAttack([1, 9])).toBe(false);
  expect(myGameboard.receiveAttack([1, 11])).toBe(false);
});

it('returns true if no ship hit, but space was valid', () => {
  const myGameboard = gameboardFactory();
  myGameboard.placeShip(4, [1, 1], 'vertical');
  expect(myGameboard.receiveAttack([1, 9])).toBe(true);
  expect(myGameboard.receiveAttack([1, 9])).toBe(false);
});

it.skip('bot hits will attempt to hit spaces around previously hit spaces', () => {
  // Testing this requires hardcoding the bot's first move to be [1, 1]
  const playerOne = playerFactory();
  const playerTwo = playerFactory(true);
  playerOne.gameboard.placeShip(4, [1, 1], 'horizontal');
  expect(playerTwo.makeHitBot(playerOne)).toBe(true);
  expect(playerTwo.makeHitBot(playerOne)).toBe(true);
  expect(playerTwo.makeHitBot(playerOne)).toBe(false);
  expect(playerTwo.makeHitBot(playerOne)).toBe(true);
  expect(playerTwo.makeHitBot(playerOne)).toBe(false);
  expect(playerTwo.makeHitBot(playerOne)).toBe(true);
});
