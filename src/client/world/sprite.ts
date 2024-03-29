import { GameObject } from "./game-object";

export class Sprite extends GameObject{
    constructor(sprite: number) {
        super(sprite);
    }

    distanceBetween(x: number, y: number, otherX: number, otherY: number) : number {
        return ((otherX - x) * (otherX - x) + (otherY - y) * (otherY - y));
    }
}