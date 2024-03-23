import { Vector } from "./vector";

export class Input {
    public upPressed = false;
    public downPressed = false;
    public leftPressed = false;
    public rightPressed = false;
    public leftMousePressed = false;
    public mouseDragStart: Vector | null = null;
    public mousePosition = new Vector(0,0);
    
    public keyQueue = [];
    
    public attachEventListeners(el: HTMLElement) {
        el.addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") { this.leftPressed = true; };
            if (e.key === "ArrowRight") { this.rightPressed = true; };
            if (e.key === "ArrowUp") { this.upPressed = true; };
            if (e.key === "ArrowDown") { this.downPressed = true; };
        });

        el.addEventListener("keyup", (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") { this.leftPressed = false; };
            if (e.key === "ArrowRight") { this.rightPressed = false; };
            if (e.key === "ArrowUp") { this.upPressed = false; };
            if (e.key === "ArrowDown") { this.downPressed = false; };
            if (e.key.length === 1 ) { this.keyQueue.push(e.key); }
        });

        el.addEventListener("mousedown", (e: MouseEvent) => {
            if (e.button === 0) {
                const rect = el.getBoundingClientRect();
                this.leftMousePressed = true;
                this.mouseDragStart = new Vector(e.clientX - rect.left, e.clientY - rect.top);
            }
        });

        el.addEventListener("mousemove", (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            this.mousePosition = new Vector(e.clientX - rect.left, e.clientY - rect.top);
        })

        el.addEventListener("mouseup", (e: MouseEvent) => {
            if ( e.button === 0) {
                this.leftMousePressed = false;
                this.mouseDragStart = null;
            }
        });

        el.addEventListener("touchstart", (e: TouchEvent) => {
            this.leftMousePressed = true;
            const rect = el.getBoundingClientRect();
            const relX = e.changedTouches.item(0).clientX - rect.left;
            const relY = e.changedTouches.item(0).clientY - rect.top;
            this.mouseDragStart = new Vector(relX, relY);
        });

        el.addEventListener("touchmove", (e: TouchEvent) => {
            const rect = el.getBoundingClientRect();
            const relX = e.changedTouches.item(0).clientX - rect.left;
            const relY = e.changedTouches.item(0).clientY - rect.top;
            this.mousePosition = new Vector(relX, relY);
        });

        el.addEventListener("touchend", (e: TouchEvent) => {
            this.leftMousePressed = false;
            this.mouseDragStart = null;
        });
    }

    public anyDirectional(): boolean {
        if (this.upPressed || this.downPressed || this.leftPressed || this.rightPressed)
            return true;

        return false;
    }

    public clearQueue() {
        this.keyQueue = [];
    }
}