export class Input {
    public upPressed = false;
    public downPressed = false;
    public leftPressed = false;
    public rightPressed = false;
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