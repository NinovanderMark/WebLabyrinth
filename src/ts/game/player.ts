import { Vector } from '../base/vector';
import { Item } from "./item";

export class Player {
    movementSpeed: number = 0.05;
    items: Array<Item> = [];

    position: Vector;
    direction: Vector;
    plane: Vector;
    lastItem: number = 0;
    score: number = 0;
    
    secretsFound: number = 0;
    scoreItemsFound: number = 0;
    
    constructor(x: number, y: number) {
        this.position = new Vector(x, y);
        this.direction = new Vector(0, -1);
        this.plane = new Vector(0.66, 0);
    }

    rotateBy(degrees: number) {
        this.direction = this.direction.rotateBy(degrees);
        this.plane = this.plane.rotateBy(degrees);
    }
}