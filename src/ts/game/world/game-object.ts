export class GameObject {
    public texture: number;

    constructor(texture: number) {
        this.texture = texture;
    }

    public collidable(): boolean {
        return true;
    }
}