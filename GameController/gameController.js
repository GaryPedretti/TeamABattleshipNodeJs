class GameController {
    static InitializeShips() {
        var colors = require("cli-color");
        const Ship = require("./ship.js");
        var ships = [
            new Ship("Aircraft Carrier", 5, colors.CadetBlue),
            new Ship("Battleship", 4, colors.Red),
            new Ship("Submarine", 3, colors.Chartreuse),
            new Ship("Destroyer", 3, colors.Yellow),
            new Ship("Patrol Boat", 2, colors.Orange)
        ];
        this.myMisses = [];
        this.enemyMisses = [];
        return ships;
    }

    static addMyMiss(position) {
        console.log("addMyMiss");

        this.myMisses.forEach( miss => {
            if( miss === position )
            {
                console.log("Duplicate miss found");
                return;
            }
        });
        console.log("My Miss pushed")
        this.myMisses.push(position);
    }

    static addEnemyMiss(position) {
        console.log("addEnemyMiss");

        this.enemyMisses.forEach( miss => {
            if( miss === position )
            {
                console.log("Enemy Duplicate miss found");
                return;
            }
        });
        console.log("Enemy Miss pushed")
        this.enemyMisses.push(position);
    }

    static CheckIsHit(ships, shot) {
        if (shot == undefined)
            throw "The shooting position is not defined";
        if (ships == undefined)
            throw "No ships defined";
        var returnvalue = false;
        ships.forEach(function (ship) {
            ship.positions.forEach(position => {
                if (position.row == shot.row && position.column == shot.column)
                {
                    //console.log("HIT--- jwm")
                    ship.addHit(position);
                    returnvalue = true;
                }
            });
        });
        return returnvalue;
    }

    static isShipValid(ship) {
        return ship.positions.length == ship.size;
    }
}

module.exports = GameController;