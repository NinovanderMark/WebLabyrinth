export class GameObject {
    public texture: number;
    public seen: boolean = false;

    constructor(texture: number) {
        this.texture = texture;
    }

    public collidable(): boolean {
        return true;
    }
}