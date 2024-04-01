import { Game } from "./client/game";
import { ResourceResolver } from "./client/resource-resolver";
import { Input } from "./client/input";
import { Renderer } from "./client/rendering/renderer";

const input = new Input();
input.attachEventListeners(document.getElementsByTagName('body')[0]);

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const depth = document.getElementById("depth") as HTMLCanvasElement;
const parent = document.getElementById("client-parent") as HTMLElement;
const resources = new ResourceResolver(parent);
const renderer = new Renderer(1024, 768, resources, canvas, depth);
const game = new Game(renderer, input);

var url = new URL("./assets/room.json", document.baseURI).href; // Local room is fallback

const params = new URLSearchParams(window.location.search);
if ( params.get('url') != null) {
    url = params.get('url');
} 

game.loadRoom(url);