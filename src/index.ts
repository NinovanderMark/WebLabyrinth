import { Game } from "./ts/game/game";
import { ResourceResolver } from "./ts/presentation/resource-resolver";
import { Input } from "./ts/presentation/input";
import { Renderer } from "./ts/presentation/rendering/renderer";
import { GuiManager } from "./ts/presentation/gui-manager";
import { GameEventHandler } from "./ts/game/events/game-event-handler";

const input = new Input();
input.attachEventListeners(document.getElementsByTagName('body')[0]);

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const depth = document.getElementById("depth") as HTMLCanvasElement;
const parent = document.getElementById("client-parent") as HTMLElement;
const resources = new ResourceResolver(parent);
const renderer = new Renderer(1024, 768, resources, canvas, depth);
const guiManager = new GuiManager(resources, parent);
const game = new Game(renderer, input, guiManager);

var url = new URL("./assets/room.json", document.baseURI).href; // Local room is fallback

const params = new URLSearchParams(window.location.search);
if ( params.get('url') != null) {
    url = params.get('url');
} 

game.loadRoom(url);