class Ship {
    constructor(name, size, color) {
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