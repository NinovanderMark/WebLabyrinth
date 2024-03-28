export class WorldObject {
    public texture: number;

    constructor(texture: number) {
        this.texture = texture;
    }

    public collidable(): boolean {
        return true;
    }
}