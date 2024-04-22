import { GameObject } from "../../game/world/game-object";

export class ViewSprite {
    public x: number;
    public y: number;
    public sprite: number;
    public scale: number;
    public gameObject: GameObject;

    constructor(x: number, y: number, sprite: number, gameObject: GameObject, scale: number = 1) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.scale = scale;
        this.gameObject = gameObject;
    }

    distanceTo(x: number, y: number) : number {
        return ((x - this.x) * (x - this.x) + (y - this.y) * (y - this.y));
    }
}