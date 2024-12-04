class Ship {
    constructor(name, size, color) {
        this.indicator = name.charAt(0);
        this.name = name;
        this.size = size;
        this.color = color;
        this.positions = [];
        this.hits = [];
        this.sunk =  false;
    }

    addPosition(position) {
        this.positions.push(position);
    }

    isOnPosition(testedPosition) {
        for (let i = 0; i < this.positions.length; i++)
        {
            let currentPosition = this.positions[i];

            if (testedPosition.row == currentPosition.row && testedPosition.column == currentPosition.column)
                return true;
        }

        return false;
    }

    addHit(position) {
        this.hits.forEach( hit => {
            if( hit == position )
            {
                console.log("Duplicate found")
                return;
            }
        });
        console.log("Hit pushed")
        this.hits.push(position);

        if( this.hits.length == this.size ){
            console.log(`${this.name} Sunk` )
            this.sunk = true;
        }
    }
}

module.exports = Ship;