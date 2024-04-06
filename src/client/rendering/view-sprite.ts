export class ViewSprite {
    public x: number;
    public y: number;
    public sprite: number;
    public scale: number;

    constructor(x: number, y: number, sprite: number, scale: number = 1) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.scale = scale;
    }

    distanceTo(x: number, y: number) : number {
        return ((x - this.x) * (x - this.x) + (y - this.y) * (y - this.y));
    }
}