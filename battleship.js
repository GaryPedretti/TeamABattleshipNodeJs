const { Worker, isMainThread } = require('worker_threads');
const readline = require('readline-sync');
const gameController = require("./GameController/gameController.js");
const gridView = require("./GameController/gridViewController.js");
const cliColor = require('cli-color');
const beep = require('beepbeep');
const position = require("./GameController/position.js");
const letters = require("./GameController/letters.js");
const GridViewController = require('./GameController/gridViewController.js');
const { exit } = require('process');


let telemetryWorker;

class Battleship {
    start() {
        //gridView.printTitleRow(null, null);
        telemetryWorker = new Worker("./TelemetryClient/telemetryClient.js");   

        console.log("Starting...");
        telemetryWorker.postMessage({eventName: 'ApplicationStarted', properties:  {Technology: 'Node.js'}});

        console.log(cliColor.magenta("                                     |__"));
        console.log(cliColor.magenta("                                     |\\/"));
        console.log(cliColor.magenta("                                     ---"));
        console.log(cliColor.magenta("                                     / | ["));
        console.log(cliColor.magenta("                              !      | |||"));
        console.log(cliColor.magenta("                            _/|     _/|-++'"));
        console.log(cliColor.magenta("                        +  +--|    |--|--|_ |-"));
        console.log(cliColor.magenta("                     { /|__|  |/\\__|  |--- |||__/"));
        console.log(cliColor.magenta("                    +---------------___[}-_===_.'____                 /\\"));
        console.log(cliColor.magenta("                ____`-' ||___-{]_| _[}-  |     |_[___\\==--            \\/   _"));
        console.log(cliColor.magenta(" __..._____--==/___]_|__|_____________________________[___\\==--____,------' .7"));
        console.log(cliColor.magenta("|                        Welcome to Battleship                         BB-61/"));
        console.log(cliColor.magenta(" \\_________________________________________________________________________|"));
        console.log();

        this.InitializeGame();
        this.StartGame();
    }

    StartGame() {

        console.log("                  __");
        console.log("                 /  \\");
        console.log("           .-.  |    |");
        console.log("   *    _.-'  \\  \\__/");
        console.log("    \\.-'       \\");
        console.log("   /          _/");
        console.log("  |      _  /");
        console.log("  |     /_\\'");
        console.log("   \\    \\_/");
        console.log("    \"\"\"\"");

        do {

            console.log(cliColor.magenta("--- Enemy Fleet ---"));
            gridView.printGridWithoutBoats(this.enemyFleet, gameController.myMisses);
            this.enemyFleet.forEach( ship => {
                if( ship.sunk )
                    console.log( cliColor.red( `Enemy ${ship.name} sunk!` ) );
            });
            console.log(" ");

            console.log(cliColor.magenta("--- My Fleet ---"));
            gridView.printGridWithBoats(this.myFleet, gameController.enemyMisses);

            console.log();
            console.log("Player, it's your turn");
            console.log("Enter coordinates for your shot :");
            var position = Battleship.ParsePosition(readline.question());
            var isHit = gameController.CheckIsHit(this.enemyFleet, position);

            telemetryWorker.postMessage({eventName: 'Player_ShootPosition', properties:  {Position: position.toString(), IsHit: isHit}});

            if (isHit) {
                beep();

                console.log("                \\         .  ./");
                console.log("              \\      .:\";'.:..\"   /");
                console.log("                  (M^^.^~~:.'\").");
                console.log("            -   (/  .    . . \\ \\)  -");
                console.log("               ((| :. ~ ^  :. .|))");
                console.log("            -   (\\- |  \\ /  |  /)  -");
                console.log("                 -\\  \\     /  /-");
                console.log("                   \\  \\   /  /");

                console.log( "Yeah ! Nice hit !" );

                if( gameController.isFleetSunk(this.enemyFleet) )
                {
                    console.log( "Congratulations!!! You Won!!!" );
                    break;
                }
            }
            else{
                console.log("Miss!")
                gameController.addMyMiss(position);
            }

            var computerPos = this.GetRandomPosition();
            var isHit = gameController.CheckIsHit(this.myFleet, computerPos);

            telemetryWorker.postMessage({eventName: 'Computer_ShootPosition', properties:  {Position: computerPos.toString(), IsHit: isHit}});

            console.log();
            console.log(`Computer shot in ${computerPos.column}${computerPos.row} and ` + (isHit ? `has hit your ship !` : `miss`));

            if (isHit) {
                beep();

                console.log("                \\         .  ./");
                console.log("              \\      .:\";'.:..\"   /");
                console.log("                  (M^^.^~~:.'\").");
                console.log("            -   (/  .    . . \\ \\)  -");
                console.log("               ((| :. ~ ^  :. .|))");
                console.log("            -   (\\- |  \\ /  |  /)  -");
                console.log("                 -\\  \\     /  /-");
                console.log("                   \\  \\   /  /");

                if( gameController.isFleetSunk(this.myFleet) )
                {
                    console.log( "To Bad, you lost..." );
                    break;
                }
            }
            else {
                gameController.addEnemyMiss(computerPos);
            }

            console.log();
            console.log();
            readline.question("Hit Enter to Continue");
        }
        while (true);
        exit(0);
    }

    static ParsePosition(input) {
        var letter = letters.get(input.toUpperCase().substring(0, 1));
        var number = parseInt(input.substring(1, 2), 10);
        return new position(letter, number);
    }

    GetRandomPosition() {
        var rows = 8;
        var lines = 8;
        var rndColumn = Math.floor((Math.random() * lines));
        var letter = letters.get(rndColumn + 1);
        var number = Math.floor((Math.random() * rows));
        var result = new position(letter, number);
        return result;
    }

    InitializeGame() {
        //For test purposes only. Matches enemy fleet.
        //this.InitializeMyTestFleet();
        
        this.InitializeMyFleet();
        this.InitializeEnemyFleet();
    }

    InitializeMyFleet() {
        this.myFleet = gameController.InitializeShips();

        console.log("Please position your fleet (Game board size is from A to H and 1 to 8) :");

        this.myFleet.forEach(function (ship) {
            console.log();
            console.log(`Please enter the positions for the ${ship.name} (size: ${ship.size})`);
            for (var i = 1; i < ship.size + 1; i++) {
                    console.log(`Enter position ${i} of ${ship.size} (i.e A3):`);
                    const position = readline.question();
                    telemetryWorker.postMessage({eventName: 'Player_PlaceShipPosition', properties:  {Position: position, Ship: ship.name, PositionInShip: i}});
                    ship.addPosition(Battleship.ParsePosition(position));
            }
        })
    }

    InitializeMyTestFleet() {
        this.myFleet = gameController.InitializeShips();

        this.myFleet[0].addPosition(new position(letters.B, 4));
        this.myFleet[0].addPosition(new position(letters.B, 5));
        this.myFleet[0].addPosition(new position(letters.B, 6));
        this.myFleet[0].addPosition(new position(letters.B, 7));
        this.myFleet[0].addPosition(new position(letters.B, 8));

        this.myFleet[1].addPosition(new position(letters.E, 5));
        this.myFleet[1].addPosition(new position(letters.E, 6));
        this.myFleet[1].addPosition(new position(letters.E, 7));
        this.myFleet[1].addPosition(new position(letters.E, 8));

        this.myFleet[2].addPosition(new position(letters.A, 3));
        this.myFleet[2].addPosition(new position(letters.B, 3));
        this.myFleet[2].addPosition(new position(letters.C, 3));

        this.myFleet[3].addPosition(new position(letters.F, 8));
        this.myFleet[3].addPosition(new position(letters.G, 8));
        this.myFleet[3].addPosition(new position(letters.H, 8));

        this.myFleet[4].addPosition(new position(letters.C, 5));
        this.myFleet[4].addPosition(new position(letters.C, 6));
    }

    InitializeEnemyFleet() {
        this.enemyFleet = gameController.InitializeShips();

        this.enemyFleet[0].addPosition(new position(letters.B, 4));
        this.enemyFleet[0].addPosition(new position(letters.B, 5));
        this.enemyFleet[0].addPosition(new position(letters.B, 6));
        this.enemyFleet[0].addPosition(new position(letters.B, 7));
        this.enemyFleet[0].addPosition(new position(letters.B, 8));

        this.enemyFleet[1].addPosition(new position(letters.E, 5));
        this.enemyFleet[1].addPosition(new position(letters.E, 6));
        this.enemyFleet[1].addPosition(new position(letters.E, 7));
        this.enemyFleet[1].addPosition(new position(letters.E, 8));

        this.enemyFleet[2].addPosition(new position(letters.A, 3));
        this.enemyFleet[2].addPosition(new position(letters.B, 3));
        this.enemyFleet[2].addPosition(new position(letters.C, 3));

        this.enemyFleet[3].addPosition(new position(letters.F, 8));
        this.enemyFleet[3].addPosition(new position(letters.G, 8));
        this.enemyFleet[3].addPosition(new position(letters.H, 8));

        this.enemyFleet[4].addPosition(new position(letters.C, 5));
        this.enemyFleet[4].addPosition(new position(letters.C, 6));
    }
}

module.exports = Battleship;