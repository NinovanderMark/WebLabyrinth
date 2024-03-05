import { Game } from "./client/game";
import { Input } from "./client/input";
import { Renderer } from "./client/renderer";

var canvas = document.getElementById("canvas") as HTMLCanvasElement;
var input = new Input();
input.attachEventListeners(document.getElementsByTagName('body')[0]);

var renderer = new Renderer(1024, 768, canvas);
var game = new Game(renderer, input);
game.tick();