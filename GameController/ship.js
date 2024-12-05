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

    //Returns 0: No hit or boat.
    //Returns 1: No hit + boat.
    //Returns 2: Hit
    whatIsOnPosition(testedPosition) {
        for (let i = 0; i < this.hits.length; i++) {
            let currentPosition = this.hits[i];

            if (currentPosition.equals(testedPosition)) {
                return 2;
            }
        }

        for (let i = 0; i < this.positions.length; i++)
        {
            let currentPosition = this.positions[i];

            if (currentPosition.equals(testedPosition)) {
                return 1;
            }   
        }

        return 0;
    }

    isHitOnPosition

    addHit(position) {
        if( this.hits.includes(position) )
        {
            console.log("Duplicate found")
            return;
        }
        // this.hits.forEach( hit => {
        //     if( hit == position )
        //     {
        //         console.log("Duplicate found")
        //         return;
        //     }
        // });
        console.log("Hit pushed")
        this.hits.push(position);

        if( this.hits.length == this.size ){
            console.log(`${this.name} Sunk` )
            this.sunk = true;
        }
    }
}

module.exports = Ship;