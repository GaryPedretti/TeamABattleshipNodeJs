class Position {
    constructor(column, row) {
        this.column = column;
        this.row = row;
    }

    toString() {
        return this.column.toString() + this.row.toString()
    }

    equals(otherPosition) {
        if (otherPosition.row == this.row && otherPosition.column == this.column)
            return true;

        return false;
    }

}

module.exports = Position;