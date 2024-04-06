import { Vector } from './vector';
import { Item } from "./item";

export class Player {
    movementSpeed: number = 0.05;
    items: Array<Item> = [];

    position: Vector;
    direction: Vector;
    plane: Vector;
    
    constructor(x: number, y: number) {
        this.position = new Vector(x, y);
        this.direction = new Vector(0, -1);
        this.plane = new Vector(0.66, 0);
    }

    rotateBy(degrees: number) {
        this.direction.rotateBy(degrees);
        this.plane.rotateBy(degrees);
    }
}