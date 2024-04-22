(()=>{"use strict";var t={19:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Color=void 0;e.Color=function(t,e,r){this.hue=t,this.saturation=e,this.lightness=r}},745:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Vector=void 0;var r=function(){function t(t,e){this.x=t,this.y=e}return t.prototype.add=function(e){return new t(this.x+e.x,this.y+e.y)},t.prototype.multiply=function(e){return new t(this.x*e,this.y*e)},t.prototype.subtract=function(e){return new t(this.x-e.x,this.y-e.y)},t.prototype.rotateBy=function(e){e=-e*(Math.PI/180);var r=Math.cos(e),o=Math.sin(e);return new t(Math.round(1e4*(this.x*r-this.y*o))/1e4,Math.round(1e4*(this.x*o+this.y*r))/1e4)},t.prototype.magnitude=function(){return Math.sqrt(this.x*this.x+this.y*this.y)},t.prototype.setLength=function(e){var r=this.magnitude();return new t(this.x*(e/r),this.y*(e/r))},t.prototype.normalize=function(){var e=this.magnitude();return new t(this.x/e,this.y/e)},t.prototype.dot=function(t){return this.x*t.x+this.y*t.y},t.prototype.cross=function(t){return this.x*t.y-t.x*this.y},t.prototype.rotationDiff=function(t){return(Math.atan2(this.y,this.x)-Math.atan2(t.y,t.x))*(180/Math.PI)},t}();e.Vector=r},775:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.GameEventHandler=void 0;var r=function(){function t(t,e){this.game=t,this.guiManager=e}return t.prototype.handle=function(t){t.handle(this)},t}();e.GameEventHandler=r},158:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.GameEvent=void 0;e.GameEvent=function(){}},296:function(t,e,r){var o,n=this&&this.__extends||(o=function(t,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r])},o(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function r(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)});Object.defineProperty(e,"__esModule",{value:!0}),e.ItemConsumedEvent=void 0;var i=function(t){function e(e){var r=t.call(this)||this;return r.item=e,r}return n(e,t),e.prototype.handle=function(t){var e=t.game.world.items.get(this.item).texture;t.guiManager.addDialog("Item consumed",e,t.game.world)},e}(r(158).GameEvent);e.ItemConsumedEvent=i},931:function(t,e,r){var o,n=this&&this.__extends||(o=function(t,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r])},o(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function r(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)});Object.defineProperty(e,"__esModule",{value:!0}),e.ItemRequiredEvent=void 0;var i=function(t){function e(e){var r=t.call(this)||this;return r.item=e,r}return n(e,t),e.prototype.handle=function(t){var e=t.game.world.items.get(this.item).texture;t.guiManager.addDialog("Missing required item",e,t.game.world)},e}(r(158).GameEvent);e.ItemRequiredEvent=i},841:(t,e,r)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Game=void 0;var o=r(538),n=r(272),i=r(745),s=r(644),a=r(866),l=r(626),c=r(775),u=r(48),h=r(284),d=r(658),p=r(858),f=function(){function t(t,e,r){this.paused=!1,this.currentTileX=0,this.currentTileY=0,this.currentTime=0,this.previousTime=0,this.renderer=t,this.input=e,this.guiManager=r,this.handler=new c.GameEventHandler(this,r),this.player=new o.Player(17,19),this.events=new Array}return t.prototype.loadLevel=function(t){var e=this,r=new URL(t);console.log("Loading new room from URL",r.href),fetch(r.href,{method:"get",mode:"cors"}).then((function(o){if(!o.ok)throw new Error("Unable to retrieve room at URL: ".concat(t));o.json().then((function(t){var o=t,i=h.Level.validate(o);i.length>0&&console.warn("Warnings were returned during room validation",i),null!=o.name&&e.guiManager.enteredLevel(o.name,o.author),e.initialize(n.World.from(o,r))}))}))},t.prototype.initialize=function(t){this.world=t;var e=this.player.score;this.player=new o.Player(t.playerStart.x,t.playerStart.y),this.player.rotateBy(t.playerRotation),this.player.score=e,this.paused=!1,this.tick()},t.prototype.levelEnd=function(t){this.paused=!0,this.guiManager.createEndScreen(this,t)},t.prototype.tick=function(){var t=this;if(!this.paused){0===this.previousTime?this.previousTime=performance.now():this.previousTime=this.currentTime,this.currentTime=performance.now();var e=(this.currentTime-this.previousTime)/1e3;this.gameStep(e),this.world.step(e),this.renderer.render(this,e),this.guiManager.tick(this,e),this.events.forEach((function(e){return t.handler.handle(e)})),this.events=[],window.requestAnimationFrame(this.tick.bind(this))}},t.prototype.addEvent=function(t){this.events.push(t)},t.prototype.gameStep=function(t){if(this.input.keyQueue.length>0&&(null!=this.input.keyQueue.find((function(t){return"m"===t}))&&this.renderer.toggleMap(),this.input.clearQueue()),this.input.usePressed||this.input.leftMouseUp){var e=s.RayCast.ray(this.player.position,this.player.direction,this.player.plane,0,this.world);e.hit&&e.perpWallDist<2&&(e.worldObject instanceof a.Door||e.worldObject instanceof d.Exit)&&e.worldObject.interact(this)}if(this.input.anyDirectional()||null!=this.input.mouseDragStart){var r=this.getMovementFromInput();if(0!==r.x||0!==r.y){var o=this.player.position.add(r);if(!(o.y>this.world.objects.length||o.y<0||o.x>this.world.objects[0].length||o.x<0)){var n=this.world.objects[this.currentTileY][this.currentTileX],c=this.world.objects[Math.floor(o.y)][Math.floor(o.x)],h=0;if(c instanceof p.GameObject){if(c.collidable())return;if(c instanceof u.Portal){h=-(c.targetPortal.targetDirection.rotationDiff(c.targetDirection)-180),(o=new i.Vector(o.x-Math.floor(o.x),o.y-Math.floor(o.y)).rotateBy(h).add(c.targetPortal.targetDirection)).x<0&&o.x++,o.y<0&&o.y++,o=o.add(c.targetPosition);for(var f=c.targetPortal.targetDirection.multiply(.1);Math.floor(o.x)===Math.floor(c.targetPosition.x)&&Math.floor(o.y)===Math.floor(c.targetPosition.y);)o=o.add(f)}}this.player.position=o,this.player.rotateBy(h),this.currentTileX=Math.floor(o.x),this.currentTileY=Math.floor(o.y),n instanceof l.Pickup&&(n.onPickup(this.player),this.world.objects[this.currentTileY][this.currentTileX]=null,this.player.lastItem=performance.now())}}}},t.prototype.getMovementFromInput=function(){this.input.leftPressed?this.player.rotateBy(1.5):this.input.rightPressed&&this.player.rotateBy(-1.5);var t=0,e=0;if(this.input.upPressed?(e+=this.player.direction.y*this.player.movementSpeed,t+=this.player.direction.x*this.player.movementSpeed):this.input.downPressed&&(e-=this.player.direction.y*this.player.movementSpeed,t-=this.player.direction.x*this.player.movementSpeed),null!=this.input.mouseDragStart){this.player.rotateBy(.01*(this.input.mouseDragStart.x-this.input.mousePosition.x));var r=5e-4*(this.input.mouseDragStart.y-this.input.mousePosition.y);r>.01?(e=this.player.direction.y*Math.min(r,this.player.movementSpeed),t=this.player.direction.x*Math.min(r,this.player.movementSpeed)):r<-.01&&(e=this.player.direction.y*Math.max(r,-this.player.movementSpeed),t=this.player.direction.x*Math.max(r,-this.player.movementSpeed))}return new i.Vector(t,e)},t}();e.Game=f},304:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Item=void 0;e.Item=function(t,e,r){void 0===r&&(r=1),this.amount=r,this.sprite=e,this.name=t}},284:(t,e,r)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Level=void 0;var o=r(155),n=r(115),i=function(){function t(){}return t.validate=function(t){var e=new Array;if(null==t.name&&e.push("No name was provided for the room"),null==t.author&&e.push("No author was provided for the room"),null==t.format?e.push("No file format identifier was provided"):t.format!==this.supportedFormat&&e.push("Provided file format of '".concat(t.format,"' does not match expected format of ").concat(this.supportedFormat)),null==t.resources)throw new Error("No resource data was specified");if(null==t.room)throw new Error("No room data was specified");return(e=e.concat(o.Resources.validate(t.resources))).concat(n.Room.validate(t.room))},t.supportedFormat="basic_v1",t}();e.Level=i},155:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Resources=void 0;var r=function(){function t(){}return t.validate=function(t){var e=new Array;if(null==t.textures||t.textures.length<1)throw new Error("Room does not reference a texture file");if(null==t.sprites||t.sprites.length<1)throw new Error("Room does not reference a sprites file");return e},t}();e.Resources=r},115:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Room=void 0;var r=function(){function t(){}return t.validate=function(t){var e=new Array;if(null==t.ceiling&&e.push("Ceiling was not specified, using default color"),null==t.floor&&e.push("Floor was not specified, using default color"),null==t.player)throw new Error("Room contains no player starting position and orientation");if(3!==t.player.length)throw new Error("Room player position and orientation expects 3 arguments, found ".concat(t.player.length));if(null==t.objects||t.objects.length<1)throw new Error("Room contains no objects");if(null==t.tiles||t.tiles.length<1)throw new Error("Room contains no tiles");for(var r=t.tiles[0].length,o=0;o<t.tiles.length;o++){if(t.tiles[o].length!=r)throw console.debug("Faulty row looks like",t.tiles[o]),new Error("Irregular row length for row ".concat(o,", expected: ").concat(r," actual: ").concat(t.tiles[o].length));for(var n=0;n<t.tiles[o].length;n++)if(t.tiles[o][n]<0||t.tiles[o][n]>t.objects.length)throw new Error("Tile reference out of bounds at coordinates ".concat(n,",").concat(o,". Should be between 0 and ").concat(t.objects.length))}return e},t}();e.Room=r},538:(t,e,r)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Player=void 0;var o=r(745),n=function(){function t(t,e){this.movementSpeed=.05,this.items=[],this.lastItem=0,this.score=0,this.secretsFound=0,this.scoreItemsFound=0,this.position=new o.Vector(t,e),this.direction=new o.Vector(0,-1),this.plane=new o.Vector(.66,0)}return t.prototype.rotateBy=function(t){this.direction=this.direction.rotateBy(t),this.plane=this.plane.rotateBy(t)},t}();e.Player=n},644:(t,e,r)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.RayCast=e.RayCastResult=void 0;var o=r(745),n=r(723),i=r(51),s=r(866),a=r(858),l=r(48),c=function(){};e.RayCastResult=c;var u=function(){function t(){}return t.ray=function(e,r,u,h,d,p,f,y){void 0===p&&(p=!1),void 0===f&&(f=0),void 0===y&&(y=8192);var v,m,w,g,x=r.x+u.x*h,b=r.y+u.y*h,P=Math.floor(e.x),_=Math.floor(e.y),j=Math.abs(1/x),M=Math.abs(1/b);x<0?(v=-1,w=(e.x-P)*j):(v=1,w=(P+1-e.x)*j),b<0?(m=-1,g=(e.y-_)*M):(m=1,g=(_+1-e.y)*M);for(var O,E,C,k,S,R=0,D=0,T=0,L=!1,W=[],A=[];0===R;)if(w<g?(w+=j,P+=v,O=0):(g+=M,_+=m,O=1),W.push(new o.Vector(P,_)),d.objects[_][P]instanceof a.GameObject)if((C=d.objects[_][P])instanceof i.Sprite){var I=new n.ViewSprite(P+.5-e.x,_+.5-e.y,C.texture,C,C.scale);A.findIndex((function(t){return t.x===I.x&&t.y===I.y}))<0&&A.push(I),p&&(R=1)}else if(C instanceof s.Door)if(C.block)C.openAmount<1&&(1===O&&g-M*(1-2*C.openAmount)<w?(R=1,E=C.texture,T=2*C.openAmount*m):0===O&&w-j*(1-2*C.openAmount)<g&&(R=1,E=C.texture,D=2*C.openAmount*v));else if(E=C.texture,R=1,1==O)if(T=.5*m,g-M/2<w){var H=e.x+this.perpendicularDistance(_,e.y,T,m,b)*x;(H-=Math.floor(H))<=C.openAmount&&(R=0,T=0)}else P+=v,O=0,L=!0,T=0,E=d.objects[_][P].texture;else if(D=.5*v,w-j/2<g){var B=e.y+this.perpendicularDistance(P,e.x,D,v,x)*b;(B-=Math.floor(B))<C.openAmount&&(R=0,D=0)}else _+=m,O=1,L=!0,D=0,E=d.objects[_][P].texture;else E=C.texture,R=1;if(0===O?(k=this.perpendicularDistance(P,e.x,D,v,x),S=e.y+k*b):(k=this.perpendicularDistance(_,e.y,T,m,b),S=e.x+k*x),S-=Math.floor(S),C instanceof l.Portal&&k+f<y){var V=-(C.targetPortal.targetDirection.rotationDiff(C.targetDirection)-180),G=new o.Vector(S*O,O?0:S).rotateBy(V).add(C.targetPortal.targetDirection);G.x<0&&G.x++,G.y<0&&G.y++,G=G.add(C.targetPosition);for(var F=C.targetPortal.targetDirection.multiply(.1);Math.floor(G.x)===Math.floor(C.targetPosition.x)&&Math.floor(G.y)===Math.floor(C.targetPosition.y);)G=G.add(F);var U=r.rotateBy(V),X=u.rotateBy(V),Y=t.ray(G,U,X,h,d,p,k+f,y);if(Y.sprites.length>0){var N=new o.Vector(S*O,O?0:S).add(C.targetDirection);N.x<0&&N.x++,N.y<0&&N.y++,N=N.add(new o.Vector(P-e.x,_-e.y)),Y.sprites.forEach((function(t){var e=new o.Vector(t.x,t.y).rotateBy(-V).add(N);A.push(new n.ViewSprite(e.x,e.y,t.sprite,t.gameObject,t.scale))})),Y.sprites=A,Y.tilesPassed=Y.tilesPassed.concat(W)}return Y}var Q=new c;return Q.sprites=A,Q.hit=1===R,Q.side=O,Q.perpWallDist=k+f,Q.inside=L,Q.worldObject=C,Q.texture=E,Q.direction=new o.Vector(x,b),Q.wallX=S,Q.tilesPassed=W,Q},t.perpendicularDistance=function(t,e,r,o,n){return(t-e+r+(1-o)/2)/n},t}();e.RayCast=u},866:function(t,e,r){var o,n=this&&this.__extends||(o=function(t,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r])},o(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function r(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)});Object.defineProperty(e,"__esModule",{value:!0}),e.Door=void 0;var i=r(858),s=r(931),a=r(296),l=function(t){function e(e,r,o,n,i){void 0===r&&(r=!1),void 0===o&&(o=!1),void 0===n&&(n=null),void 0===i&&(i=null);var s=t.call(this,e)||this;return s.closed=!0,s.openAmount=0,s.openTime=0,s.block=r,s.key=n,s.secret=o,s.unlockTexture=null!=i?i:e,s}return n(e,t),e.prototype.collidable=function(){return 1!==this.openAmount},e.prototype.unlock=function(){this.key=null,this.texture=this.unlockTexture},e.prototype.interact=function(t){var e=this;if(null!=this.key){var r=this.key,o=t.player.items.findIndex((function(t){return t.name===e.key&&t.amount>0}));return o<0?void t.addEvent(new s.ItemRequiredEvent(r)):(t.player.items[o].amount-=1,this.unlock(),void t.addEvent(new a.ItemConsumedEvent(r)))}this.closed&&0===this.openAmount?(this.closed=!1,this.openTime=0,!0===this.secret&&(t.player.secretsFound++,this.secret=!1)):this.closed||1!==this.openAmount||(this.closed=!0)},e.prototype.step=function(t){var e=this.block?.2*t:t;this.closed&&this.openAmount>0&&(this.openAmount-=e),!this.closed&&this.openAmount<1&&(console.debug("Opening",e),this.openAmount+=e),this.openAmount>1&&(this.openAmount=1),this.openAmount<0&&(this.openAmount=0),this.block||(1===this.openAmount&&(this.openTime+=t),this.openTime>5&&(this.closed=!0))},e}(i.GameObject);e.Door=l},658:function(t,e,r){var o,n=this&&this.__extends||(o=function(t,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r])},o(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function r(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)});Object.defineProperty(e,"__esModule",{value:!0}),e.Exit=void 0;var i=function(t){function e(e,r){var o=t.call(this,e)||this;return o.nextLevel=r,o}return n(e,t),e.prototype.interact=function(t){t.levelEnd(this.nextLevel)},e}(r(858).GameObject);e.Exit=i},858:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.GameObject=void 0;var r=function(){function t(t){this.seen=!1,this.texture=t}return t.prototype.collidable=function(){return!0},t}();e.GameObject=r},626:function(t,e,r){var o,n=this&&this.__extends||(o=function(t,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r])},o(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function r(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)});Object.defineProperty(e,"__esModule",{value:!0}),e.Pickup=void 0;var i=r(51),s=r(304),a=function(t){function e(e,r,o,n){void 0===o&&(o=1),void 0===n&&(n=1);var i=t.call(this,e,n)||this;return i.amount=o,i.name=r,i}return n(e,t),e.prototype.collidable=function(){return!1},e.prototype.onPickup=function(t){var e=this;if("score"===this.name)return t.score+=this.amount,void t.scoreItemsFound++;var r=t.items.findIndex((function(t){return t.name===e.name}));r>=0?t.items[r].amount+=this.amount:t.items.push(new s.Item(this.name,this.texture,this.amount))},e}(i.Sprite);e.Pickup=a},48:function(t,e,r){var o,n=this&&this.__extends||(o=function(t,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r])},o(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function r(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)});Object.defineProperty(e,"__esModule",{value:!0}),e.Portal=void 0;var i=function(t){function e(e,r){var o=t.call(this,0)||this;return o.position=e,o.targetDirection=r,o}return n(e,t),e.prototype.connect=function(t){this.targetPortal=t,this.targetPosition=t.position,this.targetPortal.targetPortal=this,this.targetPortal.targetPosition=this.position},e.prototype.collidable=function(){return!1},e}(r(858).GameObject);e.Portal=i},51:function(t,e,r){var o,n=this&&this.__extends||(o=function(t,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r])},o(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function r(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)});Object.defineProperty(e,"__esModule",{value:!0}),e.Sprite=void 0;var i=function(t){function e(e,r){void 0===r&&(r=1);var o=t.call(this,e)||this;return o.scale=r,o}return n(e,t),e.prototype.distanceBetween=function(t,e,r,o){return(r-t)*(r-t)+(o-e)*(o-e)},e}(r(858).GameObject);e.Sprite=i},272:(t,e,r)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.World=void 0;var o=r(858),n=r(866),i=r(51),s=r(658),a=r(626),l=r(48),c=r(745),u=function(){function t(){this.scoreItems=0,this.secrets=0,this.objects=[],this.dynamicObjects=[],this.items=new Map}return t.prototype.step=function(t){this.dynamicObjects.forEach((function(e){return e.step(t)}))},t.prototype.cacheDynamicObjects=function(){this.dynamicObjects.splice(0);for(var t=0;t<this.objects.length;t++)for(var e=0;e<this.objects[t].length;e++){var r=this.objects[t][e];r instanceof n.Door&&this.dynamicObjects.push(r)}},t.from=function(e,r){var u=r.pathname.split("/");u.splice(u.length-1,1);var h=u.join("/"),d=new t;d.name=e.name,d.author=e.author,d.url=r,d.textures=new URL("".concat(h,"/").concat(e.resources.textures),r.origin),d.sprites=new URL("".concat(h,"/").concat(e.resources.sprites),r.origin);var p=e.room;d.ceiling=null!=p.ceiling?p.ceiling:"#005580",d.floor=null!=p.floor?p.floor:"#2b4000",d.playerStart=new c.Vector(p.player[0],p.player[1]),d.playerRotation=p.player[2];for(var f=new Map,y=0;y<p.tiles.length;y++){for(var v=[],m=0;m<p.tiles[y].length;m++){var w=p.tiles[y][m]-1;if(w<0)v.push(!1);else{var g=p.objects[w];switch(g.type){case"block":v.push(new o.GameObject(g.texture));break;case"portal":var x=g.targetDirection,b=g.targetPortal,P=new l.Portal(new c.Vector(m,y),new c.Vector(x[0],x[1]));v.push(P),f.set(w+1,{portal:P,target:b});break;case"door":var _=g.block,j=g["texture-unlocked"],M=g.secret;v.push(new n.Door(g.texture,null!=_&&_,null!=M&&M,g.key,j));break;case"sprite":v.push(new i.Sprite(g.texture));break;case"item":var O=g.scale,E=g.amount,C=g.name,k=new a.Pickup(g.texture,C,null!=E?E:1,null!=O?O:1);v.push(k),d.items.set(C,k);break;case"exit":var S=g["next-level"];v.push(new s.Exit(g.texture,S));break;default:throw new Error("Unknown type '".concat(g.type,"' for object ").concat(w," at ").concat(m,",").concat(y))}}}v.forEach((function(t){t instanceof a.Pickup&&"score"===t.name&&d.scoreItems++,t instanceof n.Door&&!0===t.secret&&d.secrets++})),d.objects.push(v)}return f.forEach((function(t,e){var r=f.get(t.target);if(null==r)throw new Error("Unable to find Portal with id ".concat(t.target));t.portal.connect(r.portal)})),d.cacheDynamicObjects(),d},t}();e.World=u},932:(t,e,r)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.GuiManager=void 0;var o=r(881),n=r(103),i=function(){function t(t,e){this.lastScore=-1,this.texWidth=64,this.texHeight=64,this.resourceResolver=t,this.parentElement=e,this.scoreElement=document.createElement("p"),this.scoreElement.classList.add("score"),this.parentElement.appendChild(this.scoreElement)}return t.prototype.enteredLevel=function(t,e){document.title="WebLabyrinth - ".concat(t);var r=t;null!=e&&(r="<strong>".concat(r,"</strong><br>By ").concat(e)),this.addDialog(r)},t.prototype.addDialog=function(t,e,r){if(void 0===e&&(e=null),void 0===r&&(r=null),this.panel){var n=this.panel.element;this.parentElement.removeChild(n)}var i=document.createElement("div");i.classList.add("panel"),i.classList.add("dialog");var s=document.createElement("p");s.innerHTML=t,null!=e&&null!=r&&i.appendChild(this.createSpriteCanvas(e,r)),i.appendChild(s),this.parentElement.appendChild(i),this.panel=new o.Dialog(t,i,e)},t.prototype.createEndScreen=function(t,e){this.panel&&(this.parentElement.removeChild(this.panel.element),this.panel=null);var r=document.createElement("div");r.classList.add("panel");var o=document.createElement("p");if(o.classList.add("title"),o.innerText="Level complete!",r.appendChild(o),null!=t.world.name){var i=document.createElement("div");i.classList.add("level-info"),r.appendChild(i);var s=document.createElement("p");if(s.classList.add("name"),s.innerText=t.world.name,i.appendChild(s),null!=t.world.author){var a=document.createElement("p");a.classList.add("author"),a.innerText=t.world.author,i.appendChild(a)}}var l=document.createElement("table");l.classList.add("stats");var c=t.world.scoreItems>0?"<tr><td>Score</td><td>".concat(t.player.scoreItemsFound/t.world.scoreItems*100,"%</td></tr>"):"",u=t.world.secrets>0?"<tr><td>Secrets</td><td>".concat(t.player.secretsFound/t.world.secrets*100,"%</td></tr>"):"";l.innerHTML="<tbody>".concat(c).concat(u,"</tbody>"),r.appendChild(l);var h=document.createElement("button");h.classList.add("btn"),null!=e?(h.innerText="Next level",h.onclick=function(){return t.loadLevel(e)}):(h.innerText="Replay",h.onclick=function(){return t.loadLevel(t.world.url.toString())}),r.appendChild(h),this.panel=new n.Panel(r),this.parentElement.appendChild(r),h.focus()},t.prototype.tick=function(t,e){this.panel&&this.panel instanceof o.Dialog&&(this.panel.addDelta(e),this.panel.alive>4&&(this.parentElement.removeChild(this.panel.element),this.panel=null)),t.player.score!==this.lastScore&&(this.lastScore=t.player.score,this.scoreElement.innerText="".concat(this.lastScore).padStart(10,"0"))},t.prototype.createSpriteCanvas=function(t,e){var r=document.createElement("canvas");r.width=this.texWidth,r.height=this.texHeight;var o=r.getContext("2d");if(null==o)throw new Error("Unable to create 2D context");var n=this.resourceResolver.getSprites(e);return o.drawImage(n,t*this.texWidth,0,this.texWidth,this.texHeight,0,0,this.texWidth,this.texHeight),r},t}();e.GuiManager=i},321:(t,e,r)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Input=void 0;var o=r(745),n=function(){function t(){this.upPressed=!1,this.downPressed=!1,this.leftPressed=!1,this.rightPressed=!1,this.usePressed=!1,this.leftMousePressed=!1,this.previousLeftMousePressed=!1,this.mouseDragStart=null,this.mousePosition=new o.Vector(0,0),this.keyQueue=[]}return Object.defineProperty(t.prototype,"leftMouseUp",{get:function(){return!!this.previousLeftMousePressed&&(this.previousLeftMousePressed=!1,!0)},enumerable:!1,configurable:!0}),t.prototype.attachEventListeners=function(t){var e=this;t.addEventListener("keydown",(function(t){if("ArrowLeft"===t.key)e.leftPressed=!0;else if("ArrowRight"===t.key)e.rightPressed=!0;else if("ArrowUp"===t.key)e.upPressed=!0;else if("ArrowDown"===t.key)e.downPressed=!0;else{if(" "!==t.key)return;e.usePressed=!0}t.preventDefault()})),t.addEventListener("keyup",(function(t){if("ArrowLeft"===t.key)e.leftPressed=!1;else if("ArrowRight"===t.key)e.rightPressed=!1;else if("ArrowUp"===t.key)e.upPressed=!1;else if("ArrowDown"===t.key)e.downPressed=!1;else if(" "===t.key)e.usePressed=!1;else{if(1!==t.key.length)return;e.keyQueue.push(t.key)}t.preventDefault()})),t.addEventListener("mousedown",(function(r){if(0===r.button){var n=t.getBoundingClientRect();e.leftMousePressed=!0,e.mouseDragStart=new o.Vector(r.clientX-n.left,r.clientY-n.top)}})),t.addEventListener("mousemove",(function(r){var n=t.getBoundingClientRect();e.mousePosition=new o.Vector(r.clientX-n.left,r.clientY-n.top)})),t.addEventListener("mouseup",(function(t){0===t.button&&(e.leftMousePressed=!1,e.previousLeftMousePressed=!0,e.mouseDragStart=null)})),t.addEventListener("touchstart",(function(r){e.leftMousePressed=!0;var n=t.getBoundingClientRect(),i=r.changedTouches.item(0).clientX-n.left,s=r.changedTouches.item(0).clientY-n.top;e.mouseDragStart=new o.Vector(i,s)})),t.addEventListener("touchmove",(function(r){var n=t.getBoundingClientRect(),i=r.changedTouches.item(0).clientX-n.left,s=r.changedTouches.item(0).clientY-n.top;e.mousePosition=new o.Vector(i,s)})),t.addEventListener("touchend",(function(t){e.leftMousePressed=!1,e.previousLeftMousePressed=!0,e.mouseDragStart=null}))},t.prototype.anyDirectional=function(){return!!(this.upPressed||this.downPressed||this.leftPressed||this.rightPressed)},t.prototype.clearQueue=function(){this.keyQueue=[]},t}();e.Input=n},881:function(t,e,r){var o,n=this&&this.__extends||(o=function(t,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r])},o(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function r(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)});Object.defineProperty(e,"__esModule",{value:!0}),e.Dialog=void 0;var i=function(t){function e(e,r,o){void 0===o&&(o=null);var n=t.call(this,r)||this;return n.message=e,n.sprite=o,n.alive=0,n}return n(e,t),e.prototype.addDelta=function(t){this.alive+=t},e}(r(103).Panel);e.Dialog=i},103:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Panel=void 0;e.Panel=function(t){this.element=t}},243:(t,e,r)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Renderer=void 0;var o=r(19),n=r(51),i=r(866),s=r(858),a=r(644),l=function(){function t(t,e,r,o,n){this.texWidth=64,this.texHeight=64,this.screenWidth=t,this.screenHeight=e,this.resourceResolver=r,this.canvas=o,this.canvas.width=this.screenWidth,this.canvas.height=this.screenHeight;var i=this.canvas.getContext("2d");if(null==i)throw new Error("Unable to get 2D rendering context from Canvas");this.drawContext=i,this.drawContext.imageSmoothingEnabled=!1,this.parentElement=n}return t.prototype.toggleMap=function(){this.mapVisible=!this.mapVisible},t.prototype.render=function(t,e){this.drawContext.fillStyle="#000",this.drawContext.fillRect(0,0,this.screenWidth,this.screenHeight);var r=this.resourceResolver.getTextures(t.world),o=this.resourceResolver.getSprites(t.world);if(0===r.naturalWidth||0===r.naturalHeight||0===o.naturalWidth||0===o.naturalHeight)return this.drawContext.fillStyle="#fff",this.drawContext.font="30px Arial",this.drawContext.textAlign="center",void this.drawContext.fillText("Loading textures...",this.screenWidth/2,this.screenHeight/2);this.renderCeilingFloor(t),this.renderWalls(t,r,o),this.renderOverlay(t.player),this.mapVisible&&this.renderMap(t),this.renderInterface(t.player,o,e)},t.prototype.renderOverlay=function(t){var e=performance.now();if(e-t.lastItem<500){var r=.7*(1-(e-t.lastItem)/500);this.drawContext.fillStyle="rgba(255,255,255,".concat(r,")"),this.drawContext.fillRect(0,0,this.screenWidth,this.screenHeight)}},t.prototype.renderInterface=function(t,e,r){var o=this,n=16;t.items.forEach((function(t){if(!(t.amount<1||"score"===t.name)){for(var r=o.screenHeight-(n+48),i=0;i<t.amount;i++)o.drawContext.drawImage(e,t.sprite*o.texWidth,0,o.texWidth,o.texHeight,16+48*i/2,r,48,48);n+=32}}))},t.prototype.renderCeilingFloor=function(t){this.drawContext.fillStyle=t.world.ceiling,this.drawContext.fillRect(0,0,this.screenWidth,this.screenHeight/2),this.drawContext.fillStyle=t.world.floor,this.drawContext.fillRect(0,this.screenHeight/2,this.screenWidth,this.screenHeight/2)},t.prototype.renderWalls=function(t,e,r){var o=this,n=[];n.fill(0,0,this.screenWidth);for(var l=[],c=0;c<this.screenWidth;c++){var u=2*c/this.screenWidth-1,h=a.RayCast.ray(t.player.position,t.player.direction,t.player.plane,u,t.world);h.worldObject.seen=!0,h.tilesPassed.forEach((function(e){t.world.objects[e.y][e.x]instanceof s.GameObject||(t.world.objects[e.y][e.x]=!0)})),h.sprites&&h.sprites.forEach((function(t){l.findIndex((function(e){return e.x.toFixed(3)===t.x.toFixed(3)&&e.y.toFixed(3)===t.y.toFixed(3)&&e.sprite===t.sprite}))<0&&(t.gameObject.seen=!0,l.push(t))}));var d=Math.floor(this.screenHeight/h.perpWallDist),p=-d/2+this.screenHeight/2+0,f=d/2+this.screenHeight/2+0,y=h.wallX*this.texWidth;0==h.side&&h.direction.x>0&&(y=this.texWidth-y),1==h.side&&h.direction.y<0&&(y=this.texWidth-y),h.worldObject instanceof i.Door&&!h.worldObject.block&&!h.inside&&(0==h.side&&h.direction.x>0||1==h.side&&h.direction.y<0?y+=Math.floor(h.worldObject.openAmount*this.texWidth):y-=Math.floor(h.worldObject.openAmount*this.texWidth));var v=Math.floor(this.texWidth+h.texture*this.texWidth-y);this.drawContext.drawImage(e,v,0,1,this.texHeight,c,p,1,f-p),1===h.side&&(this.drawContext.strokeStyle="rgba(0,0,0,0.6)",this.drawContext.beginPath(),this.drawContext.moveTo(c,p),this.drawContext.lineTo(c,f),this.drawContext.stroke()),n[c]=h.perpWallDist}l.sort((function(t,e){return t.y===e.y?Math.abs(t.x)>Math.abs(e.x)?-1:1:Math.abs(t.y)>Math.abs(e.y)?-1:1})),l.forEach((function(e){o.renderSpriteBillboard(e,t,n,0,r)}))},t.prototype.renderSpriteBillboard=function(t,e,r,o,n){var i=1/(e.player.plane.x*e.player.direction.y-e.player.direction.x*e.player.plane.y),s=i*(e.player.direction.y*t.x-e.player.direction.x*t.y),a=i*(-e.player.plane.y*t.x+e.player.plane.x*t.y),l=Math.floor(this.screenWidth/2*(1+s/a)),c=Math.abs(Math.floor(this.screenHeight/a)),u=Math.abs(Math.floor(this.screenHeight/a))*t.scale,h=Math.floor(-u/2+l);h<0&&(h=0);var d=u/2+l;d>=this.screenWidth&&(d=this.screenWidth-1);for(var p=-c*t.scale/2+(c/2-c*t.scale/2)+this.screenHeight/2+o,f=h;f<d;f++){var y=Math.floor((f-(-u/2+l))*this.texWidth/u);if(a>0&&f>0&&f<this.screenWidth&&a<r[f]){var v=Math.min(t.sprite*this.texWidth+y,t.sprite*this.texWidth+this.texWidth);v=Math.max(v,t.sprite*this.texWidth),this.drawContext.drawImage(n,v,0,1,this.texHeight,f,p,1,c*t.scale),r[f]=a}}},t.prototype.renderMap=function(t){for(var e=0;e<t.world.objects.length;e++)for(var r=0;r<t.world.objects[e].length;r++){var a,l=t.world.objects[e][r];if(!(!(l instanceof s.GameObject)&&!1===l||l instanceof s.GameObject&&!l.seen))a=l instanceof s.GameObject?this.getBlockColor(l.texture+1):new o.Color(0,0,0),this.drawContext.fillStyle="hsl("+a.hue+","+a.saturation+"%,"+a.lightness+"%)",l instanceof n.Sprite?(this.drawContext.fillStyle="#000",this.drawContext.fillRect(8*r,8*e,8,8),l.collidable()&&(this.drawContext.strokeStyle="#f77",this.drawCircle(8*(r+.5),8*(e+.5),4))):l instanceof i.Door&&!l.block?(r>0?t.world.objects[e][r-1]:t.world.objects[e][r+1])instanceof s.GameObject?this.drawContext.fillRect(8*r,8*(e+.25),8,4):this.drawContext.fillRect(8*(r+.25),8*e,4,8):l instanceof i.Door&&l.block&&!l.closed?(this.drawContext.fillStyle="#000",this.drawContext.fillRect(8*r,8*e,8,8)):this.drawContext.fillRect(8*r,8*e,8,8),t.currentTileX===r&&t.currentTileY===e&&(this.drawContext.strokeStyle="#f0f",this.drawContext.strokeRect(8*r,8*e,8,8))}var c=8*t.player.position.x,u=8*t.player.position.y;this.drawContext.strokeStyle="#fff",this.drawCircle(c,u,4),this.drawContext.beginPath(),this.drawContext.moveTo(c,u),this.drawContext.lineTo(c+8*t.player.direction.x,u+8*t.player.direction.y),this.drawContext.stroke()},t.prototype.drawCircle=function(t,e,r){this.drawContext.beginPath(),this.drawContext.arc(t,e,r,0,2*Math.PI),this.drawContext.stroke()},t.prototype.getBlockColor=function(t){var e=0,r=100,n=50;return 0===t?(r=0,n=0):e=40*t,new o.Color(e,r,n)},t}();e.Renderer=l},723:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.ViewSprite=void 0;var r=function(){function t(t,e,r,o,n){void 0===n&&(n=1),this.x=t,this.y=e,this.sprite=r,this.scale=n,this.gameObject=o}return t.prototype.distanceTo=function(t,e){return(t-this.x)*(t-this.x)+(e-this.y)*(e-this.y)},t}();e.ViewSprite=r},392:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.ResourceResolver=void 0;var r=function(){function t(t){this.parentElement=t,this.images=new Map}return t.prototype.getTextures=function(t){var e=this.images.get(t.textures.href);return null!=e?e:this.addResource(t.textures.href)},t.prototype.getSprites=function(t){var e=this.images.get(t.sprites.href);return null!=e?e:this.addResource(t.sprites.href)},t.prototype.addResource=function(t){var e=document.createElement("img");return e.src=t,e.classList.add("hidden"),this.parentElement.appendChild(e),this.images.set(t,e),e},t}();e.ResourceResolver=r}},e={};function r(o){var n=e[o];if(void 0!==n)return n.exports;var i=e[o]={exports:{}};return t[o].call(i.exports,i,i.exports,r),i.exports}(()=>{var t=r(841),e=r(392),o=r(321),n=r(243),i=r(932),s=new o.Input;s.attachEventListeners(document.getElementsByTagName("body")[0]);var a=document.getElementById("canvas"),l=document.getElementById("depth"),c=document.getElementById("client-parent");c.style.maxWidth="".concat(1024,"px");var u=new e.ResourceResolver(c),h=new n.Renderer(1024,768,u,a,l),d=new i.GuiManager(u,c),p=new t.Game(h,s,d),f=new URL("./assets/room.json",document.baseURI).href,y=new URLSearchParams(window.location.search);null!=y.get("url")&&(f=y.get("url")),p.loadLevel(f)})()})();
//# sourceMappingURL=main.8e86a3632e00342d487d.js.map