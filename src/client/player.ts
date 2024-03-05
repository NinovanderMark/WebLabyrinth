import { Vector } from './vector';

export class Player {
    posX: number;
    posY: number;
    movementSpeed: number = 0.05;

    direction: Vector;
    plane: Vector;
    
    constructor(x: number, y: number) {
        this.posX = x;
        this.posY = y;
        this.direction = new Vector(-1, 0);
        this.plane = new Vector(0, 0.66);
    }

    rotateBy(degrees: number) {
        this.direction.rotateBy(degrees);
        this.plane.rotateBy(degrees);
    }
}