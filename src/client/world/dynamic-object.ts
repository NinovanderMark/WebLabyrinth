import { WorldObject } from "./world-object";

export class DynamicObject extends WorldObject {
    public x: number;
    public y: number;
    
    constructor(x: number, y: number, sprite: number) {
        super(sprite, false);
        this.x = x;
        this.y = y;
    }
}