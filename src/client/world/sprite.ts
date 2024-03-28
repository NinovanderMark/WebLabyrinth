import { WorldObject } from "./world-object";

export class Sprite extends WorldObject{
    constructor(sprite: number) {
        super(sprite);
    }

    distanceBetween(x: number, y: number, otherX: number, otherY: number) : number {
        return ((otherX - x) * (otherX - x) + (otherY - y) * (otherY - y));
    }
}