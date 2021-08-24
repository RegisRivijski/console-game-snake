module.exports = class SnakeBlock {
    constructor(xIndex, yIndex) {
        this.xIndex = xIndex;
        this.yIndex = yIndex;
        this.deltaX = 0;
        this.deltaY = 0;
        this.xPos = this.xIndex * 2;
        this.yPos = this.yIndex;
    }
    setDelta(deltaX, deltaY) {
        this.deltaX = deltaX;
        this.deltaY = deltaY;
    }
    setPos(x, y) {
        this.xPos = x;
        this.yPos = y;
    }
    setIndex(x, y) {
        this.xIndex = x;
        this.yIndex = y;
        this.setPos(x * 2, y);
    }
}