import { GameObject } from "./game-object";

export class Sprite extends GameObject{
    public scale: number;
    
    constructor(sprite: number, scale: number = 1) {
        super(sprite);
        this.scale = scale;
    }

    distanceBetween(x: number, y: number, otherX: number, otherY: number) : number {
        return ((otherX - x) * (otherX - x) + (otherY - y) * (otherY - y));
    }
}