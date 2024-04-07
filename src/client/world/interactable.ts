import { Game } from "../game";

export abstract class Interactable {
    public abstract interact(game: Game);
}