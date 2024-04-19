import { Vector } from '../base/vector';
import { Item } from "./item";

export class Player {
    movementSpeed: number = 0.05;
    items: Array<Item> = [];

    position: Vector;
    direction: Vector;
    plane: Vector;
    lastItem: number = 0;
    
    constructor(x: number, y: number) {
        this.position = new Vector(x, y);
        this.direction = new Vector(0, -1);
        this.plane = new Vector(0.66, 0);
    }

    get score(): number {
        let points = 0;
        this.items.forEach(i => {
            if ( i.name === 'score') {
                points+=i.amount;
            }
        })

        return points;
    }

    rotateBy(degrees: number) {
        this.direction = this.direction.rotateBy(degrees);
        this.plane = this.plane.rotateBy(degrees);
    }
}