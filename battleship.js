const { Worker, isMainThread } = require('worker_threads');
const readline = require('readline-sync');
const gameController = require("./GameController/gameController.js");
const cliColor = require('cli-color');
const beep = require('beepbeep');
const position = require("./GameController/position.js");
const letters = require("./GameController/letters.js");
let telemetryWorker;

class Battleship {
    start() {
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
        console.clear();
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

        var computerShoot=[];

        do {
            console.log();
            console.log("\n ------------------ Player, it's your turn ------------------");
            console.log("Active ships: "+ this.ActiveBoats())
            console.log("Enter coordinates for your shot :");
            var position = Battleship.ParsePosition(readline.question());
            var shipInformation = gameController.CheckIsHit(this.enemyFleet, position);
            
            telemetryWorker.postMessage({eventName: 'Player_ShootPosition', properties:  {Position: position.toString(), IsHit: shipInformation.isHit}});

            if (shipInformation.isHit) {
                beep();

                console.log(cliColor.red("                \\         .  ./"));
                console.log(cliColor.red("              \\      .:\";'.:..\"   /"));
                console.log(cliColor.red("                  (M^^.^~~:.'\")."));
                console.log(cliColor.red("            -   (/  .    . . \\ \\)  -"));
                console.log(cliColor.red("               ((| :. ~ ^  :. .|))"));
                console.log(cliColor.red("            -   (\\- |  \\ /  |  /)  -"));
                console.log(cliColor.red("                 -\\  \\     /  /-"));
                console.log(cliColor.red("                   \\  \\   /  /"));
            } else {
                console.log(cliColor.blue("                \\         .  ./"));
                console.log(cliColor.blue("              \\      .:\";'.:..\"   /"));
                console.log(cliColor.blue("                  (M^^.^~~:.'\")."));
                console.log(cliColor.blue("            -   (/  .    . . \\ \\)  -"));
                console.log(cliColor.blue("               ((| :. ~ ^  :. .|))"));
                console.log(cliColor.blue("            -   (\\- |  \\ /  |  /)  -"));
                console.log(cliColor.blue("                 -\\  \\     /  /-"));
                console.log(cliColor.blue("                   \\  \\   /  /"));
            }

            console.log(shipInformation.isHit ? cliColor.red( "Yeah ! Nice hit !") : cliColor.blue( "Miss"));
            if(shipInformation.isHit && shipInformation.ship.isSunk()){
                console.log("\n"+ shipInformation.ship.name + " is sunk! \n")
            }

            var computerPos = this.GetRandomPosition();
            
            var shipInformationComp = gameController.CheckIsHit(this.myFleet, computerPos);

            telemetryWorker.postMessage({eventName: 'Computer_ShootPosition', properties:  {Position: computerPos.toString(), IsHit: shipInformationComp.isHit}});

            console.log('\n ------------------ Computer turn ------------------');
            if (shipInformationComp.isHit) {
                beep();

                console.log(cliColor.red("                \\         .  ./"));
                console.log(cliColor.red("              \\      .:\";'.:..\"   /"));
                console.log(cliColor.red("                  (M^^.^~~:.'\")."));
                console.log(cliColor.red("            -   (/  .    . . \\ \\)  -"));
                console.log(cliColor.red("               ((| :. ~ ^  :. .|))"));
                console.log(cliColor.red("            -   (\\- |  \\ /  |  /)  -"));
                console.log(cliColor.red("                 -\\  \\     /  /-"));
                console.log(cliColor.red("                   \\  \\   /  /"));
            } else {
                console.log(cliColor.blue("                \\         .  ./"));
                console.log(cliColor.blue("              \\      .:\";'.:..\"   /"));
                console.log(cliColor.blue("                  (M^^.^~~:.'\")."));
                console.log(cliColor.blue("            -   (/  .    . . \\ \\)  -"));
                console.log(cliColor.blue("               ((| :. ~ ^  :. .|))"));
                console.log(cliColor.blue("            -   (\\- |  \\ /  |  /)  -"));
                console.log(cliColor.blue("                 -\\  \\     /  /-"));
                console.log(cliColor.blue("                   \\  \\   /  /"));
            }
            console.log(
                (shipInformationComp.isHit ? cliColor.red(`\n Computer shot in ${computerPos.column}${computerPos.row} and `): 
                cliColor.blue(`\n Computer shot in ${computerPos.column}${computerPos.row} and `))
                + (shipInformationComp.isHit ? cliColor.red(`has hit your ship !`) : cliColor.blue(`miss`))
                );
            if(shipInformationComp.isHit && shipInformationComp.ship.isSunk()){
                console.log("\n"+ shipInformationComp.ship.name + " is sunk! \n")
            }
        }
        while (true);
    }

    static ParsePosition(input) {
        var letter = letters.get(input.toUpperCase().substring(0, 1));
        var number = parseInt(input.substring(1, 2), 10);
        return new position(letter, number);
    }

    ActiveBoats(){
        var boatsActive = "";
        this.enemyFleet.forEach(boat => {
            if(!boat.isSunk()){
                boatsActive = boatsActive + boat.name + ", ";
            }
        })
        return boatsActive;
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
        this.InitializeMyFleet();
        this.InitializeEnemyFleet();
    }

    InitializeMyFleet() {
        this.myFleet = gameController.InitializeShips();

        console.log("Please position your fleet (Game board size is from A to H and 1 to 8) :");

        // this.myFleet[0].addPosition(new position(letters.B, 4));
        // this.myFleet[0].addPosition(new position(letters.B, 5));
        // this.myFleet[0].addPosition(new position(letters.B, 6));
        // this.myFleet[0].addPosition(new position(letters.B, 7));
        // this.myFleet[0].addPosition(new position(letters.B, 8));

        // this.myFleet[1].addPosition(new position(letters.E, 6));
        // this.myFleet[1].addPosition(new position(letters.E, 7));
        // this.myFleet[1].addPosition(new position(letters.E, 8));
        // this.myFleet[1].addPosition(new position(letters.E, 9));

        // this.myFleet[2].addPosition(new position(letters.A, 3));
        // this.myFleet[2].addPosition(new position(letters.B, 3));
        // this.myFleet[2].addPosition(new position(letters.C, 3));

        // this.myFleet[3].addPosition(new position(letters.F, 8));
        // this.myFleet[3].addPosition(new position(letters.G, 8));
        // this.myFleet[3].addPosition(new position(letters.H, 8));

        // this.myFleet[4].addPosition(new position(letters.C, 5));
        // this.myFleet[4].addPosition(new position(letters.C, 6));
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

    InitializeEnemyFleet() {
        this.enemyFleet = gameController.InitializeShips();

        this.enemyFleet[0].addPosition(new position(letters.B, 4));
        this.enemyFleet[0].addPosition(new position(letters.B, 5));
        this.enemyFleet[0].addPosition(new position(letters.B, 6));
        this.enemyFleet[0].addPosition(new position(letters.B, 7));
        this.enemyFleet[0].addPosition(new position(letters.B, 8));

        this.enemyFleet[1].addPosition(new position(letters.E, 6));
        this.enemyFleet[1].addPosition(new position(letters.E, 7));
        this.enemyFleet[1].addPosition(new position(letters.E, 8));
        this.enemyFleet[1].addPosition(new position(letters.E, 9));

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