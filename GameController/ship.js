class Ship {
    constructor(name, size, color) {
        this.name = name;
        this.size = size;
        this.color = color;
        this.positions = [];
        this.hitPositions = [];
    }

    addPosition(position) {
        this.positions.push(position);
    }

    checkHitPosition(hitPosition){
        if(this.positions.includes(hitPosition) && !this.hitPositions.includes(hitPosition)){
            this.hitPositions.push(hitPosition);
        }
    }

    isSunk(){
        if(this.positions.length === this.hitPositions.length){
            return true
        }
        return false
    }
}

module.exports = Ship;