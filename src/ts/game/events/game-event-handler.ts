import { GuiManager } from "../../presentation/gui-manager";
import { GameEvent } from "./game-event";
import { Game } from "../game";

export class GameEventHandler {
    public game: Game;
    public guiManager: GuiManager;

    constructor(game: Game, gui: GuiManager) {
        this.game = game;
        this.guiManager = gui;
    }

    public handle(event: GameEvent) {
        event.handle(this);
    }
}