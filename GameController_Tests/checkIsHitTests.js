const assert = require('assert').strict;
const cliColor = require('cli-color');
const gameController = require("../GameController/gameController.js");
const letters = require("../GameController/letters.js");
const position = require("../GameController/position.js");
const shipDef = require("../GameController/ship.js");

describe('checkIsHitTests', function () {

  it('should return true if there is a ship at the shooting position', function () {
    var ships = gameController.InitializeShips();
    counter = 1;
    ships.forEach(ship => {
      for (var i = 1; i <= ship.size; i++) {
        column = letters.get(counter);
        ship.addPosition(new position(letters.get(counter), i))
      }
      counter++;
    })
    var actual = gameController.CheckIsHit(ships, new position(letters.B, 3));
    assert.ok(actual);
  });

  it('should return false if there is no ship at the shooting position', function () {
    var ships = gameController.InitializeShips();
    counter = 1;
    ships.forEach(ship => {
      for (var i = 1; i <= ship.size; i++) {
        ship.addPosition(new position(letters.get(counter), i))
      }
      counter++;
    })
    var actual = gameController.CheckIsHit(ships, new position(letters.G, 1));
    assert.strictEqual(actual, false);
  });

  it('should throw an exception if positstion is undefined', function () {
    var ships = gameController.InitializeShips();
    assert.throws(
      () => {
        var actual = gameController.CheckIsHit(ships, undefined);
      }
    )
  });

  it('should throw an exception if ship is undefined', function () {
    assert.throws(
      () => {
        var actual = gameController.CheckIsHit(undefined, new position(letters.G, 1));
      }
    )
  });

  it('should track hits on a ship', function () {
    let shipSize = 5;
    let battleship = new shipDef("Battleship", shipSize);
    let fleet = [battleship];
    let shot = new position(letters.get(1), 1);
    //Add positions.
    for (let i = 1; i <= shipSize; i++) {
      battleship.addPosition(new position(letters.get(1), i));
    }

    var hitResult = gameController.CheckIsHit(fleet, shot);

    if (battleship.hits.length == 0 || hitResult == false) {
      assert.fail("Hit is missing.");
      return;
    }

    let firstHit = battleship.hits[0];

    if (!firstHit.equals(shot)) {
      assert.fail("First hit does not match shot.");
    }
  });

  it ('should track when a ship is sunk', function () {
    let shipSize = 5;
    let battleship = new shipDef("Battleship", shipSize);
    let fleet = [battleship];

    //Add positions.
    for (let i = 1; i <= shipSize; i++) {
      battleship.addPosition(new position(letters.get(1), i));
    }

    for (let i = 1; i <= shipSize; i++) {
      gameController.CheckIsHit(fleet, battleship.positions[i - 1]);
    }

    assert.equal(battleship.sunk, true, "Battleship is not sunk after being hit 5 times!");
  });

});