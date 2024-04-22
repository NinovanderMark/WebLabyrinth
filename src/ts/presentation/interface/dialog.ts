import {Panel} from "./panel";

export class Dialog extends Panel {
    public message: string;
    public sprite: number | null;
    public alive: number;

    constructor(message: string, element: HTMLElement, sprite: number | null = null) {
        super(element);
        this.message = message;
        this.sprite = sprite;
        this.alive = 0;
    }

    public addDelta(delta: number) {
        this.alive += delta;
    }
}