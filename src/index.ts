import { Game } from "./client/game";
import { Input } from "./client/input";
import { Renderer } from "./client/renderer";

const input = new Input();
input.attachEventListeners(document.getElementsByTagName('body')[0]);

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const depth = document.getElementById("depth") as HTMLCanvasElement;
const textures = document.getElementById("textures") as HTMLImageElement;
const sprites = document.getElementById("sprites") as HTMLImageElement;
var renderer = new Renderer(1024, 768, canvas, textures, sprites, depth);
var game = new Game(renderer, input);
game.tick();
