export class WorldObject {
    public texture: number;
    public block: boolean;

    constructor(texture: number, block: boolean = true) {
        this.texture = texture;
        this.block = block;
    }
}