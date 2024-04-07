export class Dialog {
    public message: string;
    public sprite: number | null;
    public alive: number;
    public element: HTMLElement;

    constructor(message: string, element: HTMLElement, sprite: number | null = null) {
        this.message = message;
        this.sprite = sprite;
        this.element = element;
        this.alive = 0;
    }

    public addDelta(delta: number) {
        this.alive += delta;
    }
}