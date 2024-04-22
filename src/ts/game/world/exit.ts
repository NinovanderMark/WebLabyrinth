import { Game } from "../game";
import { GameObject } from "./game-object";
import { Interactable } from "./interactable";

export class Exit extends GameObject implements Interactable {
    public nextLevel: string | null;

    constructor(texture: number, nextLevel: string | null) {
        super(texture);
        this.nextLevel = nextLevel;
    }

    public interact(game: Game) {
        game.levelEnd(this.nextLevel);
    }
}