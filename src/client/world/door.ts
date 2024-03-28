import { WorldObject } from "./world-object";

export class Door extends WorldObject{
    public closed: boolean;
    public openAmount: number;

    constructor(texture: number, block: boolean = false) {
        super(texture, block);
        this.closed = true;
    }
}