export class Vector {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    rotateBy(degrees: number) {
        degrees = -degrees * (Math.PI / 180);
        const cos = Math.cos(degrees);
        const sin = Math.sin(degrees);
        const newX = Math.round(10000 * (this.x * cos - this.y * sin)) / 10000;
        const newY = Math.round(10000 * (this.x * sin + this.y * cos)) / 10000;
        this.x = newX;
        this.y = newY;
    }
}