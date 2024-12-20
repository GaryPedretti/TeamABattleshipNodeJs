class GameController {
    static myMisses = [];
    static enemyMisses = [];

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

        return ships;
    }

    static addMyMiss(position) {
        if( this.myMisses.includes(position) ) {
            return;
        }

        this.myMisses.push(position);
    }

    static addEnemyMiss(position) {
        if( this.enemyMisses.includes(position) ) {
            return;
        }

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


    static isFleetSunk( fleet )
    {
        let fleetSunk = 0;
        fleet.forEach( ship => {
            if( ship.sunk )
                fleetSunk++;
        });
        if( fleet.length == fleetSunk )
        {
            return true;
        }    
        return false;
    }

}

module.exports = GameController;