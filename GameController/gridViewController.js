const cliColor = require('cli-color');
const position = require("./position.js");
const letters = require("./letters.js");
const Position = require('./position.js');

const totalColumns = 8;
const totalLines = 8;

class GridViewController {

    static printGridWithBoats(shipArray, missArray) {
        this.printTitleRow();

        for (let line = 1; line <= totalLines; line++) {
            this.printRow(shipArray, line, missArray);
        }

    }

    static printRow(shipArray, lineNumber, missArray)
    {
        
        var rowDesignation = " " + cliColor.white(lineNumber) + " ";
        var dashSeparatorRow = cliColor.blue("---");
        var lineOutput = rowDesignation;

        for (let column = 1; column <= totalColumns; column++) {
            let currentPosition = new Position(column, lineNumber);
            let isShipOnPosition = false;
            let shipOnPosition = null;

            //Check for any ships at this position;
            for (let shipNumber = 0; shipNumber < shipArray.length; shipNumber++) {
                let currentShip = shipArray[shipNumber];
                
                if (currentShip.isOnPosition(currentPosition))
                {
                    isShipOnPosition = true;
                    shipOnPosition = currentShip;
                }
            }

            //Either put an indicator here for the ship or nothing at all -- outputs 4 spaces.
            lineOutput += cliColor.blue("| ") + (isShipOnPosition ? cliColor.whiteBright(shipOnPosition.indicator) : " ") + " ";
        }

        //cap lineOutput with final |
        lineOutput += cliColor.blue("|");
        //Output line with ship info.
        console.log(lineOutput);

        //Output a dash row separator
        for (let column = 1; column <= totalColumns; column++) {
            dashSeparatorRow += cliColor.blue("----");
        }

        dashSeparatorRow += cliColor.blue("-");
        //Output dash separated row; 
        console.log(dashSeparatorRow);

    }

    static printTitleRow()
    {
        var letterRow = "   "; //3 spaces for row indicator column
        var dashRow = cliColor.blue("---");
        

        for(let i = 0; i < totalLines; i++)
        {
            letterRow += cliColor.blue("| ") + cliColor.white(letters.get(i + 1)) + " ";
        }

        letterRow += cliColor.blue("|");

        console.log(letterRow);

        for (let i = 0; i < totalLines; i++)
        {
            dashRow += cliColor.blue("----");
        }

        dashRow += cliColor.blue("-");

        console.log(dashRow);
    }
}

module.exports = GridViewController;