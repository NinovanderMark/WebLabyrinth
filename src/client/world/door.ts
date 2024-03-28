import { WorldObject } from "./world-object";
import { DynamicObject } from "./dynamic-object";
import { Interactable } from "./interactable";

export class Door extends WorldObject implements DynamicObject, Interactable {
    public closed: boolean;
    public openAmount: number;
    public block: boolean;

    constructor(texture: number, block: boolean = false) {
        super(texture);
        this.closed = true;
        this.openAmount = 0;
        this.block = block;
    }

    public override collidable(): boolean {
        return this.openAmount !== 1;
    }

    public interact() {
        if ( this.closed && this.openAmount === 0 ) {
           this.closed = false;
        } else if ( !this.closed && this.openAmount === 1) {
            this.closed = true;
        }
    }

    public step(delta: number) {
        if ( this.closed && this.openAmount > 0) { 
            console.log("Closing", this.openAmount);
            this.openAmount -= delta; 
        }
        if ( !this.closed && this.openAmount < 1) { 
            console.log("Opening", this.openAmount);
            this.openAmount += delta; 
        }

        if ( this.openAmount > 1) { this.openAmount = 1; }
        if ( this.openAmount < 0) { this.openAmount = 0; }
    }
}