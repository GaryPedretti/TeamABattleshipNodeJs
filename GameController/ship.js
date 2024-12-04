class Ship {
    constructor(name, size, color) {
        this.indicator = name.charAt(0);
        this.name = name;
        this.size = size;
        this.color = color;
        this.positions = [];
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
}

module.exports = Ship;