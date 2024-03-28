import { WorldObject } from "./world-object";

export class Door extends WorldObject{
    public closed: boolean;

    constructor(texture: number, block: boolean = false) {
        super(texture, block);
    }
}