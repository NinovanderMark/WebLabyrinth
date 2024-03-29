export class ViewSprite {
    public x: number;
    public y: number;
    public sprite: number;

    constructor(x: number, y: number, sprite: number) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
    }

    distanceTo(x: number, y: number) : number {
        return ((x - this.x) * (x - this.x) + (y - this.y) * (y - this.y));
    }
}