// ==UserScript==
// @name         x.x
// @namespace    http://tampermonkey.net/
// @version      2024-07-03
// @description  try to take over the world!
// @author       ?
// @match        https://starve.io/*
// @run-at       document-start
// @require      https://unpkg.com/guify@0.12.0/lib/guify.min.js
// @grant        unsafeWindow
// ==/UserScript==

const packets = {
    drop: 24,
    dropall: 31,
    extPut: 27,
    extTake: 37,
    placeBuild: 22,
    joinTotem: 17,
    angle: 0,
    attack: 36,
    stopAttack: 16,
    chestPut: 1,
    chestTake: 8,
    equip: 34,
    recycle: 18,
    craft: 26,
    revive: 33,
};

const Timers = {
healtimer: 10,
}

const SandstormImage = new Image();
SandstormImage.src = "https://raw.githubusercontent.com/XmreLoux/images/main/sandstorm.png";
const BlizzardImage = new Image();
BlizzardImage.src = "https://raw.githubusercontent.com/XmreLoux/images/main/blizzard.png";

let Settings = {
    ColoredSpikes:true,
    announcer:false,
    SwordInchest: {
      enabled:false,
      key:"KeyE"
    },
    AutoSpike: {
        key: "Space",
        enabled: false
    },
    POD:{
      enabled:false,
      key:"KeyJ"
    },
    ZMA:{
      enabled:false,
      ley:"KeyJ"
    },
    AutoPutRed: {
        key: "KeyC",
        enabled: false,
    },
    drawID:true,
    BoxOnTop:true,
    drop: {
        key: "KeyN",
        enabled: false,
    },
    roofs:true,
    AMB: {
        enabled: false,
        key: "KeyF",
        a: null,
        t: null,
    },
    AutoFeed: {
        enabled: true
    },
    AutoRespawn: {
    enabled:false,
    key:"NULL",
    },
    dropsword: {
        enabled: false,
        key: "KeyV"

    },
    AutoCrown: {
    enabled: false,
    key:"KeyZ",
  },
    AutoCraft: {
        enabled: false,
        key: "KeyK"
    },
        Spectator: {
           enabled: false,
          key: "KeyP",
          keyMode: "press",
           speed: .5 },
    AutoRecycle: {
        enabled: false,
        key: "KeyL"
    },
    pathfinder: {
        enabled: false,
        key: "Numpad1",
        x: null,
        y: null,
        chaseid: null,
        movetoenemy:false,
    },
    zmaafk :{
enabled:false,
key:"keyQ"

    },
    AutoSteal: {
        enabled: false,
        key: "KeyQ",
        draw: true
    },
    AutoTotem: {
        enabled: false,
        key: "KeyH"
    },
    ExtractorInfo: {
        enabled: true
    },
    ExtractorSteal: {
        enabled: false,
        key: "KeyI"
    },
    ExtractorPut: {
        enabled: false,
        key: "KeyP"
    },
    Autofarm: {
        enabled: false,
        water: false,
        key: "NONE",
        keyMode: "press",
        angle: null,
        x: 0,
        y: 0,
        xx: 0,
        yy: 0,
        sx: 0,
        sy: 0
    },
    nows: {
        autoextractortake: Date.now(),
        autoextractorput: Date.now(),
        autobreadtake: Date.now(),
        autobreadput: Date.now(),
        autocraft: Date.now(),
        autorecycle: Date.now(),
        autosteal: Date.now(),
        autobuild: Date.now(),
        autototem: Date.now(),
        autoseed: Date.now(),
        autocrown: Date.now(),
        dropsword: Date.now(),
        SwordInchest: Date.now(),
        autospike: Date.now(),
        autofarm: Date.now()
    }
}

let LAST_CRAFT;
let LAST_RECYCLE;

let world;
let client;
let _this
let game
let user;
let ui;
let mouse
let log = console.log
unsafeWindow.log = log

log(unsafeWindow)
let master = Symbol()

function hooks() {
    Object.defineProperty(Object.prototype, "timeout", {
        get() {
            return this[master]
        },
        set(data) {
            this[master] = data;
            if (!client) {
                client = this;
                log(client);
                unsafeWindow.client = client;
            }
        },
    })
    Object.defineProperty(Object.prototype, "mapping", {
        get() {
            return this[master]
        },
        set(data) {
            this[master] = data;
            if (!_this) {
                _this = this;
                log(_this);
                unsafeWindow._this = _this;
            }
        },
    })


Object.defineProperty(Object.prototype, "options", {
            get() {
                return this[master];
            },
            set(data) {
                    this[master] = data;
            if (!game) {

              if(this.sign) {
                game = this
                log(game);
                unsafeWindow.game = game;

              }
            }
        },
    });



    Object.defineProperty(Object.prototype, "IDLE", {
        get() {
            return this[master]
        },
        set(data) {
            this[master] = data;
            if (!mouse) {
                mouse = this;
                log(mouse);
                unsafeWindow.mouse = mouse;
            }
        },
    })

    Object.defineProperty(Object.prototype, "opacity", {
        get() {if(Settings.roofs){
            this[master] = 0.5
        }
            return this[master]
        },
        set(data) {
            this[master] = data;

        },
    })
    Object.defineProperty(Screen.prototype, "width", {
        get: function() {
            return 3840;
        },
        set: function(v) {
            this[master] = v;
        }
    });
    Object.defineProperty(Screen.prototype, "height", {
        get: function() {
            return 2160;
        },
        set: function(v) {
            this[master] = v;
        }
    });

    Object.defineProperty(Object.prototype, "mode", {
        get() {
            return this[master]
        },
        set(data) {
            this[master] = data;
            if (!world) {
                world = this;
                log(world);
                unsafeWindow.world = world;

              }
        },
    })

    Object.defineProperty(Object.prototype, "control", {
        get() {
            return this[master]
        },
        set(data) {
            this[master] = data;
            if (!user) {
                user = this;
                log(user);
                unsafeWindow.user = user;
                ads()
                disableVideo()
                //unsafeWindow.gapi.load = function(){}
            }
        },
    })
}
hooks()
const TIMER = {
        COLD_COUNTER: 6,
    }

function send(data) {
  let sock
    sock = Object.keys(client)[0]
    client[sock].send(JSON.stringify(data))

}
unsafeWindow.send = send

function unit() {
    let units = Object.keys(world)[4]
    return world[units];
}
unsafeWindow.unit = unit

function myplayer() {
    const pid = Object.values(user)[17];
    const fast_units = Object.values(world)[5][pid];
    return fast_units;
}

function chatxterm() {
    if (document.getElementById("chat_block").style.display === 'inline-block' || document.getElementById("commandMainBox").style.display === 'inline-block') {
        return true;
    } else {
        return false;
    }
}

function gauges() {
    const gauge = Object.values(user)[29];
    const gauge2 = Object.values(gauge)[2]
    return gauge2;
}
function Gen(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
function gauges2() {

    const gauge = Object.values(user)[29];
    const gauge2 = Object.values(gauge)[1]

    return gauge2;
}

function inventoryHas(id) {

    const inv = Object.values(user)[34];
    const invN = Object.values(inv)[3]

    if (invN[id] !== 0 && invN[id] !== undefined) {
        return [true, invN[id]]
    } else {
        return [false, undefined]
    }
}


function isAlive() {
    let team = Object.keys(user)[10]
    return user[team];
}

function getUserPosition() {

    let camx;
    let camy;
    for (let prop1 in user) {
        for (let prop2 in user[prop1]) {
            switch (prop2) {
                case "x":
                    //log("hooked camx: " + "user." + prop1 + "." + prop2);
                    camx = user[prop1][prop2];
                    break;
                case "y":
                    //log("hooked camy: " + "user." + prop1 + "." + prop2);
                    camy = user[prop1][prop2];
                    break;
            }
        }
    }
    return [camx, camy]
}

let pidPropName;
let assignPidPropNameInterval

function pid() {
    let fastUnitsUserUid = myplayer()
    if (fastUnitsUserUid) {
        let pidPropNameCounter = 0;
        for (let prop in fastUnitsUserUid) {
            if (typeof fastUnitsUserUid[prop] === "number") {
                pidPropNameCounter++;
                if (pidPropNameCounter === 2) {
                    if (fastUnitsUserUid[prop] === user.id) {
                        pidPropName = prop;
                        //log("hooked pid in units");
                        //log(pidPropName)
                        clearInterval(assignPidPropNameInterval);
                    } else {
                        alert("[ERROR] FAILED TO HOOK PID");
                        clearInterval(assignPidPropNameInterval);
                    }
                }
            }
        }
    }
}

function isValid(grid, x, y) {
    return x >= 0 && y >= 0 && x < grid.length && y < grid[0].length && grid[x][y] === 0;
}

function reconstructPath(parentMap, start, end) {
    const path = [];
    let [currentX, currentY] = end;

    while (`${currentX},${currentY}` !== `${start[0]},${start[1]}`) {
        const parentData = parentMap.get(`${currentX},${currentY}`);
        path.push(parentData.direction);
        [currentX, currentY] = parentData.parent.split(',').map(Number);
    }

    return path.reverse();
}
function isAlly(id) {

let team = Object.values(user)[21]


        switch (id) {
            case user.id:
                return true;
            default:
                    return team.includes(id);

        }
    }

let FlyPorpName;
let asignedFlyInterval

function Fly() {
    let fastUnitsUserUid = myplayer()
    if (fastUnitsUserUid) {
        let pidPropNameCounter = 0;
        for (let prop in fastUnitsUserUid) {
            if (typeof fastUnitsUserUid[prop] === "number") {
                //log(prop)
                pidPropNameCounter++;
                if (pidPropNameCounter === 26) {

                    FlyPorpName = prop;
                    clearInterval(asignedFlyInterval);

                }
            }
        }
    }
}

let ClothePorpName;
let asignedClotheInterval

function Clothes() {
    let fastUnitsUserUid = myplayer()
    if (fastUnitsUserUid) {
        let pidPropNameCounter = 0;
        for (let prop in fastUnitsUserUid) {
            if (typeof fastUnitsUserUid[prop] === "number") {
                pidPropNameCounter++;
                if (pidPropNameCounter === 38) {
                    ClothePorpName = prop;
                    clearInterval(asignedClotheInterval);

                }
            }
        }
    }

}

let drawSpike = null;
let drawSpshi

function dropSword() {

    requestAnimationFrame(dropSword)
    let date = Date.now()
    let mp = myplayer()
    if (Settings.dropsword.enabled) {
        if (date - Settings.nows.dropsword > 20) {
            if (HoldWeapon(mp.right)) {

                send([packets.dropall, mp.right])

            }
            Settings.nows.dropsword = date;
        }
    }
}

function drawsp() {

    if (drawSpike === null || drawSpike === "null") {
        [5, 12, 13, 14, 20, 52, 10, 15, 16, 17, 21, 51, 45, 46, 47, 48, 49, 53].forEach((id) => {
            if (unit()[id].length > 0) {
                for (let e in unit()[id]) {
                    for (const k in unit()[id][e]) {
                        if (typeof unit()[id][e][k] === "function") {
                            if (unit()[id][e][k].toString().includes("width")) {
                                drawSpike = k;
                                clearInterval(drawSpshi)
                            } else {
                                clearInterval(drawSpshi)
                            }
                        }
                    }
                }
            }
        });
    }
}

unsafeWindow.sp = drawsp

function updatePathfinderPosition() {
    const me = myplayer()
    if (me) {
        Settings.pathfinder.x = Math.floor(me.x / 100);
        Settings.pathfinder.y = Math.floor(me.y / 100);
    };
};

function HoldWeapon(e, c) {
        switch (e) {
            case 34:
            case 18:
            case 33:
            case 15:
            case 14:
            case 13:
            case 12:
            case 16:
            case 17:
                return 2;
            case 57:
            case 5:
            case 6:
            case 30:
            case 62:
            case 9:
            case 0:
            case 63:
            case 19:
                return 1;
            case 64:
            case 65:
            case 66:
            case 67:
            case 68:
            case 70:
            case 69:
                return 3;
            case 94:
            case 95:
            case 96:
            case 97:
            case 98:
            case 90:
            case 99:
                return 6;
            case 45:
                if (c) return 4;
            case -1:
                if (c) return 5
        }
        return 0
    }

        function calcAngle(e, a, c) {
        return e && a ? c ? Math.atan2(a.r.y - e.r.y, a.r.x - e.r.x) : Math.atan2(a.y - e.y, a.x - e.x) : null
    }

    function dist2dSQRT(e, a) {
        return e && a ? Math.sqrt((e.x - a.x) ** 2 + (e.y - a.y) ** 2) : null
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////


const packetHandler= (event) => {
  let gauges = Object.keys(user)[29]
let l = Object.keys(gauges)[1]
    let mp = myplayer()
    if ("string" === typeof event.data) {
        event = JSON.parse(event.data);
        switch (event[0]) {
            case 2:
            if(Settings.announcer){
                log(event[2] + "|" + event[1])
                send([8,event[2] + "|" + event[1]])
                mp.text.push(event[2] + "|" + event[1])
            }
                break;
        }
    } else {
        let ui8 = new Uint8Array(event.data)
        switch (ui8[0]) {
            case 16:

                hp = ui8[1]
                if(Math.floor(11-(Date.now() - Timers.healtimer) / 1e3) < 5 || hp > user[gauges][l]) Timers.healtimer = Date.now();
                log(hp)
                break;
        }

    }
}
function checks() {
  requestAnimationFrame(checks)
let sock = Object.keys(client)[0]
let myPlayer = myplayer()
	if (!myPlayer) return;

	if (!client[sock]["current"]) {
		client[sock]["current"] = true;
		client[sock].addEventListener("message", packetHandler);
	}

}


function nwnh(){
let nw = Object.values(world)[6]
let nh = Object.values(world)[7]

unsafeWindow.wrld = {
nw: nw,
nh: nh,
}
}
const directions = {
    8: [-1, 0], // up
    4: [1, 0],  // down
    1: [0, 1],  // right
    2: [0, -1]  // left
};
function findpath(grid, start, end) {
    const [startX, startY] = start;
    const [endX, endY] = end;

    if (!isValid(grid, startX, startY) || !isValid(grid, endX, endY)) {
        return [];
    }

    const queue = [[startX, startY]];
    const visited = new Set([`${startX},${startY}`]);
    const parentMap = new Map();

    while (queue.length > 0) {
        const [currentX, currentY] = queue.shift();

        if (currentX === endX && currentY === endY) {
          let send_move = Object.keys(client)[122]
            const path = reconstructPath(parentMap, start, end);
            path.forEach(direction => client[send_move](direction));
            return path;
        }

        for (const [direction, [dx, dy]] of Object.entries(directions)) {
            const newX = currentX + dx;
            const newY = currentY + dy;

            if (isValid(grid, newX, newY) && !visited.has(`${newX},${newY}`)) {
                queue.push([newX, newY]);
                visited.add(`${newX},${newY}`);
                parentMap.set(`${newX},${newY}`, { parent: `${currentX},${currentY}`, direction: Number(direction) });
            }
        }
    }

    return []; // No path found
}


function Pathfinder() {
    let me = myplayer()

if(Settings.zmaafk.enabled && me && isAlive() === true) {
    let send_move = Object.keys(client)[122]

    const myPos = {
        x: Math.floor(me.x / 100),
        y: Math.floor(me.y / 100),
    };
if (myPos.x === 0 && myPos.y === 29) {

        client[send_move](4)
    } else if (myPos.x === 0 && myPos.y === 34) {

        client[send_move](8)
    }
}

if (Settings.POD.enabled && me && isAlive() === true) {

    let send_move = Object.keys(client)[122]

    const myPos = {
        x: Math.floor(me.x / 100),
        y: Math.floor(me.y / 100),
    };
    if (myPos.x === 48 && myPos.y === 48) {

        client[send_move](8)
    } else if (myPos.x === 48 && myPos.y === 45) {
        direction = 1
        client[send_move](1)
    }
    else if (myPos.x === 44 && myPos.y === 46) {

        client[send_move](8)
    }
}
if (Settings.ZMA.enabled && me && isAlive() === true) {
    let send_move = Object.keys(client)[122]
    let direction;
    const myPos = {
        x: Math.floor(me.x / 100),
        y: Math.floor(me.y / 100),
    };
    if (myPos.x === 67 && myPos.y === 12) {
        direction = 4
        client[send_move](4)
    } else if (myPos.x === 67 && myPos.y === 15) {
        direction = 1
        client[send_move](1)
    }

}

    let Pathfinde = (myPlayer, Nearest) => {
                            let y1 = myPlayer.y, x1 = myPlayer.x, x2 = Nearest ? Nearest.x : x, y2 = Nearest ? Nearest.y : 0;
                            let Pathfind = 0
                            if (y1 < y2 - 25 && Nearest) Pathfind += 4;
                            if (y1 > y2 + 25 && Nearest) Pathfind += 8;
                            if (x1 < x2 - 25) Pathfind += 2
                            if (x1 > x2 + 25) Pathfind += 1
                            return Pathfind;
                        }

     if(Settings.pathfinder.movetoenemy && isAlive() ===true && me) {
      const myPos = {
                x: Math.floor(me.x / 100),
                y: Math.floor(me.y / 100),
            };
const endPos = {
                x: Math.floor(32),
                y: Math.floor(32),
            }
      let send_move = Object.keys(client)[122]
        for(let aa = 0; aa < unit()[0].length; aa++) {
            if(unit()[0][aa][pidPropName] == Settings.pathfinder.chaseid) {

                 var path = 0;
                var papaa = {
                    x: 0,
                    y: 0
                }
                papaa.x = Math.floor(unit()[0][aa].x / 100);
                papaa.y = Math.floor(unit()[0][aa].y / 100);
                if((me.y - unit()[0][aa].y), + (me.x - unit()[0][aa].x)) {

                  path = Pathfinde(me,unit()[0][aa]);
                  log(path)
                  client[send_move](path);
                }
            }
    }
    }

    if (Settings.pathfinder.enabled && me && isAlive() === true) {

        if (Settings.pathfinder.x != null && Settings.pathfinder.y != null) {
            const myPos = {
                x: Math.floor(me.x / 100),
                y: Math.floor(me.y / 100),
            };

const xRange = Array.from({ length: 6 }, (_, i) => i + 63);
const yRange = Array.from({ length: 6 }, (_, i) => i + 10);
let grid = (unsafeWindow.wrld.nw, unsafeWindow.wrld.nh)
            const endPos = {
                x: Math.floor(Settings.pathfinder.x),
                y: Math.floor(Settings.pathfinder.y),
            }
            if (xRange.includes(myPos.x) && yRange.includes(myPos.y)) {
                log("hi")
            } else {

                findpath(grid, myPos, endPos)
            }
        };
    };

}

function podid() {
requestAnimationFrame(podid)

if(Settings.drop.enabled) {
send([packets.dropall,7])
}

}

function SwordInChest() {
    requestAnimationFrame(SwordInChest)
    function angleCalculator(a, b) {
                    let angle;
                    if ((a + b) > 254) {
                        angle = (a + b) - 254
                    }
                    if ((a + b) < 0) {
                        angle = 254 + (a + b)
                    }
                    if ((a + b) >= 0 && (a + b) < 254) {
                        angle = a + b
                    }
                    return angle
                }
    let mp = myplayer()
    const date = Date.now();

    function getdist(a, b) {
        return Math.sqrt(((b.x - a.x) * (b.x - a.x)) + ((b.y - a.y) * (b.y - a.y)));
    }
if (date - Settings.nows.SwordInchest > 80) {
    if (isAlive() === true && chatxterm() === false && Settings.SwordInchest.enabled) {

        var chest = unit()[11];
        for (let i = 0; i < chest.length; ++i) {

            if (HoldWeapon(mp.right) && getdist(mp, chest[i]) <= 330) {

                send([packets.chestPut, mp.right, 10, chest[i][pidPropName], chest[i].id])
                send([packets.chestTake, chest[i][pidPropName], chest[i].id]);

            } else if(HoldWeapon(mp.right) && inventoryHas(167)&& !getdist(mp, chest[i]) <= 330) {

                    let pi2 = Math.PI * 2;
                    let currAngle = Math.floor((mp.angle + pi2) % pi2 * 255 / pi2);

                send([packets.placeBuild, 167, currAngle, 0]);
            for (let inddex = 10; inddex < 30; inddex += 3) {
                send([packets.placeBuild, 167, (-inddex + currAngle) % 255, 0]);
                send([packets.placeBuild, 167, (inddex + currAngle) % 255, 0]);
            }

            }
        }
    }
    Settings.nows.SwordInchest = date;
    }
}

function drawID() {
requestAnimationFrame(drawID)
let player = unit()[0]
let mp = myplayer()
    const canvas = document.getElementById("game_canvas");
    const ctx = canvas.getContext("2d");


 function draw_transition(o, a1, a2) {
     let u = Object.keys(world)[14]
     let shades = Object.values(world[u])[1]

     if (world.transition) {
         ctx.globalAlpha = 1;
         o[drawSpike](a1, a2);
         world.time = world.time ? 0 : 1;
         ctx.globalAlpha = 1 - shades;
         o[drawSpike](a1, a2);
         world.time = world.time ? 0 : 1;
         ctx.globalAlpha = 1;
     } else o[drawSpike](a1, a2);
 };


if (Settings.drawID && mp && isAlive() === true) {

    let w = Object.values(unit()[0])[0]
    let plid = Object.keys(w)[1]
    for (let players of player) {
        ctx.lineWidth = 7;
        ctx.strokeStyle = "#000";
        ctx.font = "22px Baloo Paaji"
        ctx.strokeText(players[plid], getUserPosition()[0] + players.x, getUserPosition()[1] + players.y + 50);
        ctx.fillStyle = "#00ffcc";
        ctx.fillText(players[plid], getUserPosition()[0] + players.x, getUserPosition()[1] + players.y + 50);
    }

}

}

function draWBox() {

    function draw_transition(o, a1, a2) {
        let u = Object.keys(world)[14]
        let shades = Object.values(world[u])[1]

        const canvas = document.getElementById('game_canvas')
        const ctx = canvas.getContext('2d')
        if (world.transition) {
            ctx.globalAlpha = 1;
            o[drawSpike](a1, a2);
            world.time = world.time ? 0 : 1;
            ctx.globalAlpha = 1 - shades;
            o[drawSpike](a1, a2);
            world.time = world.time ? 0 : 1;
            ctx.globalAlpha = 1;
        } else o[drawSpike](a1, a2);
    };

    const canvas = document.getElementById("game_canvas");
    const ctx = canvas.getContext("2d");
    requestAnimationFrame(draWBox)
    let mp = myplayer()
    if (Settings.BoxOnTop && mp && isAlive() === true) {
        let crate = unit()[86];
        let dead_box = unit()[82];

        for (let i = 0; i < crate.length; i++) {
            let crates = crate[i]
            draw_transition(crates, 250, 729);
            ctx.lineWidth = 7;
            ctx.strokeStyle = "#000";
            ctx.font = "22px Baloo Paaji"
            ctx.strokeText("Box", getUserPosition()[0] + crates.x, getUserPosition()[1] + crates.y);
            ctx.fillStyle = "#00ffcc";
            ctx.fillText("Box", getUserPosition()[0] + crates.x, getUserPosition()[1] + crates.y);
        }
        for (let i = 0; i < dead_box.length; i++) {
            let boxes = dead_box[i]
            draw_transition(boxes, 250, 729);
            ctx.strokeText("Dead BOX", getUserPosition()[0] + boxes.x, getUserPosition()[1] + boxes.y);
            ctx.fillStyle = "#00ffcc";
            ctx.fillText("Dead BOX", getUserPosition()[0] + boxes.x, getUserPosition()[1] + boxes.y);
        }

    }

}

function autoresp() {
    let killed = Object.keys(client)[137]
    let stealtoken = Object.keys(client)[136]
    let join = Object.keys(_this)[85]

    let oldKilled = client[killed]

    client[killed] = function() {
        if (Settings.AutoRespawn.enabled) {
            client[stealtoken]()
            _this.waiting = false
            _this[join]()
        }

        return oldKilled.apply(this, arguments)
    }

}
const disableVideo = () => {
    const observer = new MutationObserver(function (mutations) {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (
                    node.src &&
                    (
                        node.src.includes("server.cmpstar.net") ||
                        node.src.includes("sdk.truepush.com") ||
                        node.src.includes("sdki.truepush.com") ||
                        node.src.includes("adinplay") ||
                        node.src.includes("amazon-adsystem.com") ||
                        node.src.includes("www.google-analytics.com") ||
                        node.src.includes("ib.adnxs.com") ||
                        node.src.includes("targeting.unrulymedia.com") ||
                        node.src.includes("www.google-analytics.com") ||
                        node.src.includes("pagead2.googlesyndication.com") ||
                        node.src.includes("doubleclick.net") ||
                        node.src.includes("script.4dex.io")
                    )
                ) {
                    node.src = "";
                    node.innerHTML = "";
                    node.textContent = "";
                }

                if (node.className === "wg-ad-container") {
                    setTimeout(function () {
                        const ad = document.querySelector(".wg-ad-player");
                        ad.currentTime = 20;
                        const holder = ad.parentElement;
                        holder.style.display = 'none';
                    }, 1);
                }
            }
        }
    });

    observer.observe(document, {
        childList: true,
        attributes: true,
        subtree: true
    });
};
function ads() {
    document.getElementById("ssIFrame_google")
    let uwu = document.getElementById("preroll")
    let uws = document.getElementById("trevda")
    let style = document.createElement('style');

    uwu.remove()
    uws.remove()
    style.innerHTML = '.grecaptcha-badge { visibility: hidden; }';

    document.head.appendChild(style);
    console.log(uwu + ":" + uws)
    console.log("removed")
}

function autoBook() {

    let craft = Object.keys(client)[95]

    client[craft] = (id) => {

        LAST_CRAFT = id

        send([packets.equip, 28])
        send([packets.craft, id]);
        return 1;
    };
}

function autoputred() {

    let mp = myplayer()

    function getdist(a, b) {
        return Math.sqrt(((b.x - a.x) * (b.x - a.x)) + ((b.y - a.y) * (b.y - a.y)));
    }

    if (isAlive() === true && chatxterm() === false && Settings.AutoPutRed.enabled) {
        var chest = unit()[11];
        for (let i = 0; i < chest.length; ++i) {
            if (getdist(mp, chest[i]) <= 330) {

                send([packets.chestPut, 202, 10, chest[i][pidPropName], chest[i].id])
                send([packets.chestPut, 111, 10, chest[i][pidPropName], chest[i].id])

            }
        }

    }

}

let cooldowns = {
	Autofarm: Date.now(),
};

function autofarm() {
function calcAngle(e, a, c) {
        return e && a ? c ? Math.atan2(a.r.y - e.r.y, a.r.x - e.r.x) : Math.atan2(a.y - e.y, a.x - e.x) : null
    }




let send_move = Object.keys(client)[122]
let myPlayer = myplayer()
requestAnimationFrame(autofarm)
if(Settings.Autofarm.enabled) {
  if (Date.now() - cooldowns.Autofarm > 50) {
			//type 1 = water
			//type 2 = collect
			//type 0 = undefinied
			let Target = {
				obj: null,
				dist: -1,
				type: 0
			};
			var rect1 = {
				x: Settings.Autofarm.x,
				y: Settings.Autofarm.y,
				width: Settings.Autofarm.xx - Settings.Autofarm.x,
				height: Settings.Autofarm.yy - Settings.Autofarm.y
			}
			//use flat instead of ...array thx dickhead lann
			for(var i = 0, objects = [
        ...unit()[3],
				...unit()[31],
				...unit()[37],
				...unit()[39],
				...unit()[40],
				...unit()[43],
				...unit()[44],
				...unit()[54],
				...unit()[55]
        ], len = objects.length, Berry = null, d = null; i < len; ++i) {
				Berry = objects[i];
				if(!Berry.info || Berry.info === 10) continue; //  :joy:
				if(!Settings.Autofarm.water && Berry.info === 16) continue;

				if(rect1.x < Berry.x - 50 + 100 &&
				rect1.x + rect1.width > Berry.x - 50 &&
				rect1.y < Berry.y - 50 + 100 &&
				rect1.y + rect1.height > Berry.y - 50) { //todo fix it
          let o = Object.keys(mouse)[4];
  if (Settings.Autofarm.enabled && Settings.Autofarm.angle != null) {
    mouse[o].x = getUserPosition()[0] + Berry.x;
    mouse[o].y = getUserPosition()[1] + Berry.y;
  }
					d = (myPlayer.x - Berry.x) ** 2 + (myPlayer.y - Berry.y) ** 2;
					if(Target.dist === -1 || d < Target.dist) {
						Target.dist = d;
						Target.obj = Berry;
					};
				};
			};
			function dist2dSQRT2(p1, p2) {
    if(p1 && p2) {
        return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
    };
    return null
};
			if(Target.obj) {
				Target.dist = dist2dSQRT2(myPlayer, Target.obj);
				switch(Target.obj.info) {
				    case 1:
					case 2:
					case 3:
          log("uwu")
						if(inventoryHas(54)[0]) {
							if((myPlayer.right !== 54)) {
								send([packets.equip, 54]);
							};
						} else if(inventoryHas(53)[0]) {
							if(myPlayer.right !== 53) {
								send([packets.equip, 53]);
							};
						};
						Target.type = 2;
						break;
					case 16:
					case 17:
					case 18:
					case 19:
						if(Settings.Autofarm.water) {
							if(inventoryHas(49)[0]) {
								if(myPlayer.right !== 49) send([packets.equip, 49]);
								Target.type = 1;
							};
						} else {
							if(inventoryHas(54)[0]) {
								if((myPlayer.right !== 54)) {
									send([packets.equip, 54]);
								};
							} else if(inventoryHas(53)[0]) {
								if(myPlayer.right !== 53) {
									send([packets.equip, 53]);
								};
							};
							Target.type = 2;
						};
						break;

				};

				//Go to target and do the job
				//Movement
				let Coors = {
					x: myPlayer.x - Target.obj.x,
					y: myPlayer.y - Target.obj.y
				};
				let CoorsABS = {
					x: Math.abs(myPlayer.x - Target.obj.x),
					y: Math.abs(myPlayer.y - Target.obj.y)
				};
				let velocity = 0; //need to do diagnol movements :>

				if(CoorsABS.x > 60) { //If we far from goal like 1 plot it will go near or else it will not
					if(Coors.x > 50) velocity += 1;
					if(Coors.x < 50) velocity += 2;
				};
				if(CoorsABS.y > 60) {
					if(Coors.y > 50) velocity += 8;
					if(Coors.y < 50) velocity += 4;
				};
				client[send_move](velocity);

				//Aim todo dist shit here so it doesnt try to hit 1km away berries // done
				if(CoorsABS.x < (Target.type === 1 ? 120 : 300) && CoorsABS.y < (Target.type === 1 ? 120 : 300)) {
					Settings.Autofarm.angle = calcAngle(myPlayer, Target.obj, true);
					let e = 2 * Math.PI;
					let Angle255 = Math.floor((((Settings.Autofarm.angle + e) % e) * 255) / e);
					if(Settings.Autofarm.angle) {
						send([packets.attack, Angle255]);
						send([packets.stopAttack]);
					};
				};
			} else {
				let Coors = {
					x: myPlayer.x - Settings.Autofarm.sx,
					y: myPlayer.y - Settings.Autofarm.sy
				};
				let CoorsABS = {
					x: Math.abs(myPlayer.x - Settings.Autofarm.sx),
					y: Math.abs(myPlayer.y - Settings.Autofarm.sy)
				};
				let velocity = 0;

				if(CoorsABS.x > 60) {
					if(Coors.x > 0) velocity += 1;
					if(Coors.x < 0) velocity += 2;
				};
				if(CoorsABS.y > 60) {
					if(Coors.y > 0) velocity += 8;
					if(Coors.y < 0) velocity += 4;
				};
				client[send_move](velocity);

		}
    cooldowns.Autofarm = Date.now();
	}
}
}

function aimbot() {
    requestAnimationFrame(aimbot);
    let myPlayer = myplayer();

    function EnemyToAttack(myPlayer, PlayerList) {
        let nearest = null;
        let distSqrd = -1;
        let HoldingSpear = HoldWeapon(myPlayer.right, false) === 2 ? true : false;

        for (var i = 0, obj = null, d = null; i < PlayerList.length; ++i) {
            obj = PlayerList[i];
            if (obj[pidPropName] === myPlayer[pidPropName] || isAlly(obj[pidPropName])) continue; // Skip self and allies
            if (!isAlly(obj[pidPropName]) && myPlayer[FlyPorpName] === obj[FlyPorpName] && !obj.ghost) {
                d = (myPlayer.x - obj.x) ** 2 + (myPlayer.y - obj.y) ** 2;
                if (HoldingSpear && d < 210) continue;
                if (distSqrd === -1 || d < distSqrd) {
                    distSqrd = d;
                    nearest = obj;
                }
            }
        }
        let pos = Object.keys(mouse)[4]
        if (Settings.AMB.enabled && Settings.AMB.a != null) {
            mouse[pos].x = getUserPosition()[0] + nearest.x;
            mouse[pos].y = getUserPosition()[1] + nearest.y;
        }

        return nearest;
    }


    if (Settings.AMB.enabled && myPlayer && isAlive() === true) {
        const weaponType = HoldWeapon(myPlayer.right, true);
        let myRange;
        switch (weaponType) {
            case 1:
                myRange = myPlayer[FlyPorpName] ? 196.8 : 157.6;
                break;
            case 2:
                myRange = myPlayer[FlyPorpName] ? 291.8 : 227.6;
                break;
            case 3:
                myRange = 620;
                break;
            case 4:
                myRange = myPlayer[FlyPorpName] ? 140 : 125;
                break;
            case 5:
                myRange = myPlayer.clothe == 85 || myPlayer.clothe == 83 ? (myPlayer[FlyPorpName] ? 120.8 : 97.6) : null;
                break;
            default:
                myRange = null;
                break;
        }
        if (myRange) {
            const Enemy = EnemyToAttack(myPlayer, unit()[0]);
            if (Enemy) {
                const RangeBetweenMeAndEnemy = dist2dSQRT(myPlayer, Enemy);
                if (RangeBetweenMeAndEnemy <= myRange) {
                    Settings.AMB.a = calcAngle(myPlayer, Enemy, true);
                    Settings.AMB.t = Enemy;
                    const e = 2 * Math.PI;
                    const Angle255 = Math.floor((((Settings.AMB.a + e) % e) * 255) / e);
                    send([packets.angle, Angle255]);

                    if (Settings.AMB.a && RangeBetweenMeAndEnemy <= myRange - 22 && myPlayer.right !== 45) {
                        send([packets.attack, Angle255]);
                        send([packets.stopAttack]);
                    }
                } else {
                    Settings.AMB.a = null;
                    Settings.AMB.t = null;
                }
            } else {
                Settings.AMB.a = null;
            }
        }
    }
}

function autoCraft() {

    let craftInterval;

    function sendCraft() {
        if (LAST_CRAFT !== undefined && gauges() < 0.60 && !window.AutoEatWait) {

            unsafeWindow.AutoEatWait = true;
            const foodItems = [110, 117]
            for (const item of foodItems) {
                if (inventoryHas(item)[0]) {
                    send([packets.equip, item])
                }
            }
            setTimeout(() => {
                unsafeWindow.AutoEatWait = false;
            }, 500);
        } else {
            send([packets.craft, LAST_CRAFT]);
        }
    }

    document.addEventListener('keydown', function(event) {
        if (event.code === Settings.AutoCraft.key) {
            if (Settings.AutoCraft.enabled == false && chatxterm() === false) {
                sendCraft();
                craftInterval = setInterval(sendCraft, 20)
                Settings.AutoCraft.enabled = true;
            } else {
                if (Settings.AutoCraft.enabled == true) {
                    clearInterval(craftInterval);
                    Settings.AutoCraft.enabled = false;
                }
            }
        }
    });

}

function autoRecycle() {

    let RecycleInterval;

    function sendRecycle() {
        if (isAlive() === true && LAST_RECYCLE !== undefined && gauges() < 0.60 && !window.AutoEatWait) {
            unsafeWindow.AutoEatWait = true;
            const foodItems = [110, 117]
            for (const item of foodItems) {
                if (inventoryHas(item)[0]) {
                    send([packets.equip, item])
                }
            }
            setTimeout(() => {
                unsafeWindow.AutoEatWait = false;
            }, 500);
        } else {
            send([packets.recycle, LAST_RECYCLE]);
        }
    }

    document.addEventListener('keydown', function(event) {
        if (event.code === Settings.AutoRecycle.key) {
            if (Settings.AutoRecycle.enabled == false && chatxterm() === false) {
                sendRecycle();
                RecycleInterval = setInterval(sendRecycle, 20)
                Settings.AutoRecycle.enabled = true;
            } else {
                if (Settings.AutoRecycle.enabled == true) {
                    clearInterval(RecycleInterval);
                    Settings.AutoRecycle.enabled = false;
                }
            }
        }
    });
}
Timers.healtimer = Date.now();
function healTimer() {
    requestAnimationFrame(healTimer);
    const canvas = document.getElementById("game_canvas");
    const ctx = canvas.getContext("2d");
if(isAlive() === true){
    let autofeed = Object.values(user)[36];
    const timeLeft = Math.floor(11 - (Date.now() - Timers.healtimer) / 1e3) + "s";
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 7;
    ctx.fillStyle = "#00ffcc";
    ctx.strokeStyle = "#000";
    ctx.font = '34px Baloo Paaji';

    ctx.strokeText(Math.floor(11 - (Date.now() - Timers.healtimer) / 1e3) + "s", autofeed.translate.x - ctx.measureText(timeLeft).width / 2, autofeed.translate.y + 34);
    ctx.fillText(Math.floor(11 - (Date.now() - Timers.healtimer) / 1e3) + "s", autofeed.translate.x - ctx.measureText(timeLeft).width / 2, autofeed.translate.y + 34);

    ctx.restore();
}
}


function Autoeat() {
    requestAnimationFrame(Autoeat)
    if (isAlive() === true && gauges() < 0.60 && !window.AutoEatWait) {
        unsafeWindow.AutoEatWait = true;
        const foodItems = [110, 117]
        for (const item of foodItems) {
            if (inventoryHas(item)) {
                send([packets.equip, item])
            }
        }
        setTimeout(() => {
            unsafeWindow.AutoEatWait = false;
        }, 500);
    }

}


function blizzard() {
requestAnimationFrame(blizzard)
    let blizzard1 = Object.keys(user)[47]
    let sandstorm = Object.keys(user)[46]
    let tempset = Object.keys(sandstorm)[1]


let autofeed = Object.values(user)[36]


    var use = -8;

    const canvas = document.getElementById("game_canvas");
    const ctx = canvas.getContext("2d");

    if (isAlive() === true && user[blizzard1][tempset]) { //27
        ctx.save();
        ctx.drawImage(
            BlizzardImage,
            autofeed.translate.x,
            autofeed.translate.y + use
        );
        use += 70;
    }
    if (isAlive() === true &&  user[sandstorm][tempset]) { //26
        ctx.save();
        ctx.drawImage(
            SandstormImage,
            autofeed.translate.x,
            autofeed.translate.y + use
        );
        use += 70;
    }
}

function colors() {
    if (isAlive() === true && Settings.ColoredSpikes) {
        unsafeWindow.ReiditeSpikeAlly = new Image;
        unsafeWindow.ReiditeSpikeAlly.src = "https://raw.githubusercontent.com/sfagasdzdgfhs/spikes/main/day-reidite-spike-ally.png"
        unsafeWindow.AmethystSpikeAlly = new Image;
        unsafeWindow.AmethystSpikeAlly.src = "https://raw.githubusercontent.com/sfagasdzdgfhs/spikes/main/day-amethyst-spike-ally.png"
        unsafeWindow.DiamondSpikeAlly = new Image;
        unsafeWindow.DiamondSpikeAlly.src = "https://raw.githubusercontent.com/sfagasdzdgfhs/spikes/main/day-diamond-spike-ally.png"
        unsafeWindow.GoldSpikeAlly = new Image;
        unsafeWindow.GoldSpikeAlly.src = "https://raw.githubusercontent.com/sfagasdzdgfhs/spikes/main/day-gold-spike-ally.png"
        unsafeWindow.StoneSpikeAlly = new Image;
        unsafeWindow.StoneSpikeAlly.src = "https://raw.githubusercontent.com/sfagasdzdgfhs/spikes/main/day-stone-spike-ally.png"
        unsafeWindow.WoodSpikeAlly = new Image;
        unsafeWindow.WoodSpikeAlly.src = "https://raw.githubusercontent.com/sfagasdzdgfhs/spikes/main/day-wood-spike-ally.png"

        unsafeWindow.ReiditeSpikeEnemy = new Image;
        unsafeWindow.ReiditeSpikeEnemy.src = "https://raw.githubusercontent.com/sfagasdzdgfhs/spikes/main/day-reidite-spike-enemy.png"
        unsafeWindow.AmethystSpikeEnemy = new Image;
        unsafeWindow.AmethystSpikeEnemy.src = "https://raw.githubusercontent.com/sfagasdzdgfhs/spikes/main/day-amethyst-spike-enemy.png"
        unsafeWindow.DiamondSpikeEnemy = new Image;
        unsafeWindow.DiamondSpikeEnemy.src = "https://raw.githubusercontent.com/sfagasdzdgfhs/spikes/main/day-diamond-spike-enemy.png"
        unsafeWindow.GoldSpikeEnemy = new Image;
        unsafeWindow.GoldSpikeEnemy.src = "https://raw.githubusercontent.com/sfagasdzdgfhs/spikes/main/day-gold-spike-enemy.png"
        unsafeWindow.StoneSpikeEnemy = new Image;
        unsafeWindow.StoneSpikeEnemy.src = "https://raw.githubusercontent.com/sfagasdzdgfhs/spikes/main/day-stone-spike-enemy.png"
        unsafeWindow.WoodSpikeEnemy = new Image;
        unsafeWindow.WoodSpikeEnemy.src = "https://raw.githubusercontent.com/sfagasdzdgfhs/spikes/main/day-wood-spike-enemy.png"

        let ITEMS = {
            SPIKE: 5,
            STONE_SPIKE: 12,
            GOLD_SPIKE: 13,
            DIAMOND_SPIKE: 14,
            AMETHYST_SPIKE: 20,
            REIDITE_SPIKE: 52,
        }

        unsafeWindow.ITEMS_TO_CHECK = {
            SPIKE: 5,
            STONE_SPIKE: 12,
            GOLD_SPIKE: 13,
            DIAMOND_SPIKE: 14,
            AMETHYST_SPIKE: 20,
            REIDITE_SPIKE: 52,
        }
        let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMOPQRSTUVWXYZ_0123456789";

        for (let e in unsafeWindow) {
            if (!Array.isArray(unsafeWindow[e]) && chars.includes(e[0])) continue;
            if (unsafeWindow[e].length > 800 && unsafeWindow[e].length < 1500) unsafeWindow.sprite = unsafeWindow[e];
        }
        sprite[10000] = [WoodSpikeAlly, WoodSpikeAlly];
        sprite[10001] = [WoodSpikeEnemy, WoodSpikeEnemy];

        sprite[10002] = [StoneSpikeAlly, StoneSpikeAlly];
        sprite[10003] = [StoneSpikeEnemy, StoneSpikeEnemy];

        sprite[10004] = [GoldSpikeAlly, GoldSpikeAlly];
        sprite[10005] = [GoldSpikeEnemy, GoldSpikeEnemy];

        sprite[10006] = [DiamondSpikeAlly, DiamondSpikeAlly];
        sprite[10007] = [DiamondSpikeEnemy, DiamondSpikeEnemy];

        sprite[10008] = [AmethystSpikeAlly, AmethystSpikeAlly];
        sprite[10009] = [AmethystSpikeEnemy, AmethystSpikeEnemy];

        sprite[10010] = [ReiditeSpikeAlly, ReiditeSpikeAlly];
        sprite[10011] = [ReiditeSpikeEnemy, ReiditeSpikeEnemy];

        let push = Array.prototype.push
        Array.prototype.push = function(p) {
            if (p) {
                let a = Object.keys(p);
                5 == a.length && a.includes("draw") && a.includes("in_button") && 32 !== p.id && 130 !== p.id && 127 !== p.id && 4 !== p.id && 25 !== p.id && 34 !== p.id && 87 !== p.id && (unsafeWindow.inventory = this);
            }
            unsafeWindow.wow = [drawSpike]
            if (p && null != p.type && null != p.id && p.x && p.y)
                switch ((0 === p.type && pidPropName === unsafeWindow.playerID && (unsafeWindow.player = p), p.type)) {

                    case ITEMS.SPIKE: {
                        p.ally = unsafeWindow.playerID === p[pidPropName] || isAlly(p[pidPropName]);
                        let l = p[wow]; // draw
                        p[wow] = function(a) {
                            return Settings.ColoredSpikes ? (p.ally ? l.apply(this, [1e4]) : l.apply(this, [10001])) : l.apply(this, arguments);
                        };
                        break;
                    }
                    case ITEMS.STONE_SPIKE: {
                        p.ally = unsafeWindow.playerID === p[pidPropName] || isAlly(p[pidPropName]);
                        let i = p[wow]; // draw
                        p[wow] = function(a) {
                            return Settings.ColoredSpikes ? (p.ally ? i.apply(this, [10002]) : i.apply(this, [10003])) : i.apply(this, arguments);
                        };
                        break;
                    }
                    case ITEMS.GOLD_SPIKE: {
                        p.ally = unsafeWindow.playerID === p[pidPropName] || isAlly(p[pidPropName]);
                        let e = p[wow]; // draw
                        p[wow] = function(a) {
                            return Settings.ColoredSpikes ? (p.ally ? e.apply(this, [10004]) : e.apply(this, [10005])) : e.apply(this, arguments);
                        };
                        break;
                    }
                    case ITEMS.DIAMOND_SPIKE: {
                        p.ally = unsafeWindow.playerID === p[pidPropName] || isAlly(p[pidPropName]);
                        let t = p[wow]; // draw
                        p[wow] = function(a) {
                            return Settings.ColoredSpikes ? (p.ally ? t.apply(this, [10006]) : t.apply(this, [10007])) : t.apply(this, arguments);
                        };
                        break;
                    }
                    case ITEMS.AMETHYST_SPIKE: {
                        p.ally = unsafeWindow.playerID === p[pidPropName] || isAlly(p[pidPropName]);
                        let r = p[wow]; // draw
                        p[wow] = function(a) {
                            return Settings.ColoredSpikes ? (p.ally ? r.apply(this, [10008]) : r.apply(this, [10009])) : r.apply(this, arguments);
                        };
                        break;
                    }
                    case ITEMS.REIDITE_SPIKE: {
                        p.ally = unsafeWindow.playerID === p[pidPropName] || isAlly(p[pidPropName]);
                        let y = p[wow]; // draw
                        p[wow] = function(a) {
                            return Settings.ColoredSpikes ? (p.ally ? y.apply(this, [10010]) : y.apply(this, [10011])) : y.apply(this, arguments);
                        };
                        break;
                    }
                    case unit()[0]: {
                        console.log(p)
                        let w = p[wow]
                        console.log(w)
                    }
                }
            return push.apply(this, arguments);
        };
    }
}

function checkgame() {
requestAnimationFrame(checkgame)

const canvas = document.getElementById("game_canvas");
const ctx = canvas.getContext("2d");

if(game.sign === undefined){
const canvas = document.getElementById("game_canvas");
    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 6;
    ctx.fillStyle = "#00ffcc";
    ctx.strokeStyle = "black";
    ctx.font = "22px Baloo Paaji";
    ctx.strokeText("chest infos not gona work. refresh page", 3, 500);
    ctx.fillText("chest infos not gona work. refresh page", 3, 500);
    ctx.restore();
}

}

function Visuals() {
    requestAnimationFrame(Visuals);
    try {
        unsafeWindow.ctx = document.getElementById("game_canvas").getContext("2d");
    } catch (error) {
        return;
    }

    let i = 22.5;
    for (hack in Settings) {
        if (Settings[hack].enabled && Settings[hack].key) {
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = 6;
            ctx.fillStyle = "#00ffcc";
            ctx.strokeStyle = "black";
            ctx.font = "22px Baloo Paaji";
            ctx.strokeText(hack, 3, i);
            ctx.fillText(hack, 3, i);
            ctx.restore();
            i += 22.5;
        }
    }
}

function extractorsInfo() {

    const ctx = document.querySelector("canvas").getContext("2d");

    function extractors_engine() {
        requestAnimationFrame(extractors_engine);
        const mp = myplayer()

        function extractor_info() {
            const extractor_ids = [24, 25, 26, 27, 28];
            for (let i = 0; i < extractor_ids.length; ++i) {
                const spikeType = extractor_ids[i];
                const extractors = unit()[spikeType];
                if (isAlive() === true) {
                    for (let j = 0; j < extractors.length; j++) {
                        const extractor = extractors[j];
                        ctx.save();
                        ctx.lineWidth = 7;
                        ctx.font = "20px Baloo Paaji";
                        ctx.strokeStyle = "#000";
                        ctx.fillStyle = (extractor.info & 0xFF) > 0 ? "#00ffcc" : "#00ffcc";
                        ctx.strokeText(`${extractor.info & 0xFF}`, W= (extractor.x - 20) + getUserPosition()[0], extractor.y + getUserPosition()[1]);
                        ctx.fillText(`${extractor.info & 0xFF}`, (extractor.x - 20) + getUserPosition()[0], extractor.y + getUserPosition()[1]);
                        ctx.restore();
                    }

                    for (let j = 0; j < extractors.length; ++j) {
                        const extractor = extractors[j];
                        ctx.save();
                        ctx.lineWidth = 7;
                        ctx.font = "20px Baloo Paaji";
                        ctx.strokeStyle = "#000";
                        ctx.fillStyle = (extractor.info >> 8) > 0 ? "#00ffcc" : "#00ffcc";
                        ctx.strokeText(`${(extractor.info & 0xFF00) >> 8}`, (extractor.x - 20) + getUserPosition()[0], (extractor.y + 20) + getUserPosition()[1]);
                        ctx.fillText(`${(extractor.info & 0xFF00) >> 8}`, (extractor.x - 20) + getUserPosition()[0], (extractor.y + 20) + getUserPosition()[1]);
                        ctx.restore();
                    }
                }
            }
        }

        extractor_info();


    }
    extractors_engine();
}

function extractors() {
    requestAnimationFrame(extractors)
    const date = Date.now();

    function getdist(a, b) {
        return Math.sqrt(((b.x - a.x) * (b.x - a.x)) + ((b.y - a.y) * (b.y - a.y)));
    }

    let mp = myplayer()
    if (date - Settings.nows.autoextractortake > 100) {
        const extractor_ids = [24, 25, 26, 27, 28, 29];

        extractor_ids.forEach((extractorType) => {
            var extractor = unit()[extractorType];

            if (isAlive() === true && chatxterm() === false && Settings.ExtractorSteal.enabled) {
                for (let i = 0; i < extractor.length; ++i) {
                    if (getdist(mp, extractor[i]) <= 330) {

                        send([packets.extTake, extractor[i][pidPropName], extractor[i].id, extractorType]);

                    }

                }
            }

        });
        Settings.nows.autoextractortake = date;
    }
}

function extractorsPut() {

    requestAnimationFrame(extractorsPut)
    const date = Date.now();


    function getdist(a, b) {
        return Math.sqrt(((b.x - a.x) * (b.x - a.x)) + ((b.y - a.y) * (b.y - a.y)));
    }
    let mp = myplayer()
    if (date - Settings.nows.autoextractorput > 100) {
        const extractor_ids = [24, 25, 26, 27, 28, 29];

        extractor_ids.forEach((extractorType) => {
            var extractor = unit()[extractorType];
            if (isAlive() === true && chatxterm() === false && Settings.ExtractorPut.enabled) {
                for (let j = 0; j < extractor.length; ++j) {
                    if (getdist(mp, extractor[j]) <= 330) {

                        send([packets.extPut, 68, extractor[j][pidPropName], extractor[j].id, extractorType]);

                    }
                }
            }
        });
        Settings.nows.autoextractorput = date;
    }
}


function autoSteal1() {

    let mp = myplayer()

    function getdist(a, b) {
        return Math.sqrt(((b.x - a.x) * (b.x - a.x)) + ((b.y - a.y) * (b.y - a.y)));
    }

    if (isAlive() === true && chatxterm() === false && Settings.AutoSteal.enabled) {
        var chest = unit()[11];
        for (let i = 0; i < chest.length; ++i) {
            if (getdist(mp, chest[i]) <= 330) {

                send([packets.chestTake, chest[i][pidPropName], chest[i].id]);

            }
        }
    }

}

function ctxDrawImage(ctx, img, b, c, d, e, f, g, h, i) {
	if (img.tryLoad === undefined || img.tryLoad() === 1) {
		if (i !== undefined) ctx.drawImage(img, b, c, Math.max(1, d), Math.max(1, e), f, g, h, i);
		else if (e !== undefined) ctx.drawImage(img, b, c, d, e);
		else ctx.drawImage(img, b, c);
	}
}
function drawinchest() {
    requestAnimationFrame(drawinchest)
const ctx = document.getElementById("game_canvas").getContext("2d");
    let chest_buttons = Object.keys(game)[44];
    let chests = unit()[11]

    for(let chest of chests){

let chest_buttons = Object.keys(game)[44];


        let chestindex = chest.action / 2 - 1;
        let okpok = game[chest_buttons][chestindex]?.info;


        let chestarr;
        let uwu

            if (chest.action) {

              uwu = Object.keys(okpok)[2]
chestarr = okpok[uwu][0];

                ctx.save();
                ctx.globalAlpha = 0.9;
                ctxDrawImage(ctx, chestarr, getUserPosition()[0] + chest.x - 25, getUserPosition()[1] + chest.y - 25, 67, 52);
                ctx.globalAlpha = 1;
                ctx.font = "20px Baloo Paaji";
                ctx.strokeStyle = "black";
                ctx.lineWidth = 7;
                ctx.strokeText("x" + chest.info, getUserPosition()[0] + chest.x - 12, getUserPosition()[1] + chest.y + 35);
                ctx.fillStyle = "#00ffcc";
                ctx.fillText("x" + chest.info, getUserPosition()[0] + chest.x - 12, getUserPosition()[1] + chest.y + 35);
                ctx.restore();
            }
        }
}

function tot() {

    function getdist(a, b) {
        return Math.sqrt(((b.x - a.x) * (b.x - a.x)) + ((b.y - a.y) * (b.y - a.y)));
    }

    const mp = myplayer()

    const ctx = document.querySelector("canvas").getContext("2d");

    requestAnimationFrame(tot);

    const totem = unit()[29]
    if (totem === undefined || totem.length === undefined || totem.length === 0) {
        return;
    };

    function totinfo() {
        for (let i = 0; i < totem.length; ++i) {
            const {
                x,
                y,
                info
            } = totem[i];
            let totw = unit()[29][i]
            ctx.save();
            ctx.lineWidth = 8;
            ctx.font = "22px Baloo Paaji";
            ctx.strokeStyle = "#000";
            ctx.fillStyle = totw.info >= 16 ? "#00ffcc" : "#00ffcc";;

            ctx.strokeText(info >= 16 ? "Locked" : "Open", (x - 20) + getUserPosition()[0], y + getUserPosition()[1]);
            ctx.fillText(info >= 16 ? "Locked" : "Open", (x - 20) + getUserPosition()[0], y + getUserPosition()[1]);



            const infoText = totw.info >= 16 ? "Players: " + totw.info % 16 : "Players: " + totw.info;
            ctx.font = '20px Baloo Paaji';
            ctx.strokeStyle = '#000';
            ctx.fillStyle = "#00ffcc";
            ctx.fillText(infoText, (totw.x - 20) + getUserPosition()[0], totw.y + getUserPosition()[1] - 30);
            ctx.restore();



            ctx.restore();
        }

    }
    if (isAlive() === true && chatxterm() === false && Settings.AutoTotem.enabled) {
        for (let i = 0; i < totem.length; ++i) {
            if (getdist(mp, totem[i]) <= 300) {
                send([packets.joinTotem, totem[i][pidPropName], totem[i].id])

            }
        }
    }

    totinfo();

}

function Autosh() {

    let stopattack = Object.keys(client)[119]
    let reborn = Object.keys(client)[103]
    let gauges = Object.keys(user)[29]

    let oldAttackstop = client[stopattack]
    let oldReborn = client[reborn]
    let oldGauges = user[gauges]


    client[stopattack] = function() {
        Settings.AutoCrown.attack = false;

        return oldAttackstop.apply(this, arguments)
    };
    client[reborn] = function() {
        if (Settings.AutoCrown.enabled) {
            send([packets.equip, 79]);
            send([packets.equip, Settings.AutoCrown.last]);
        }

        return oldReborn.apply(this, arguments)

    };

}

function getBestHammer() {
    if (inventoryHas(39)) {
      return 39;
    }
    if (inventoryHas(38)) {
      return 38;
    }
    if (inventoryHas(37)) {
      return 37;
    }
    if (inventoryHas(36)) {
      return 36;
    }
    if (inventoryHas(35)) {
      return 35;
    }
    return 7;
  }

function AutoCrown() {

const UTILS = {
            DISTANCE: (P1,P2) => {
                return Math.sqrt((P1.x - P2.x) ** 2 + (P1.y - P2.y) ** 2);
            }
        };

   function getdist(a, b) {
        return Math.sqrt(((b.x - a.x) * (b.x - a.x)) + ((b.y - a.y) * (b.y - a.y)));
    }
    requestAnimationFrame(AutoCrown)

    let stopattack = Object.keys(client)[119]
    let reborn = Object.keys(client)[103]

    let ghost = Object.keys(user)[8]
    let mp = myplayer()

    if (mp && !user[ghost].enabled) Settings.AutoCrown.last = mp.right;
    if (!Settings.AutoCrown.enabled) return;
    if (!inventoryHas(79)) return;
    if (!user[ghost].enabled) return;

    let ressurections = unit()[22];

    if (ressurections.length < 1) return;
    let myPlayer = mp;

    ressurections.forEach(ressurection => {
        if (getdist(ressurection, mp) <= 400) {
            send([packets.revive, ressurection[pidPropName], ressurection.id]);

        }
    });

}

function recycle() {

    let rec = Object.keys(client)[115]
    client[rec] = (id) => {
        LAST_RECYCLE = id
        send([packets.recycle, id]);

    };

}

let readys = {
    AutoSpike: true,
    SwordInChest: true,
    AutoFarm: true,
    AutoWall: true,
    AutoCraft: true,
};


function auto() {
    requestAnimationFrame(auto)
    if (chatxterm() === false) {
        let spikeToPlace = undefined;

        if (inventoryHas(219)[0]) {
            spikeToPlace = 219;
        } else if (inventoryHas(123)[0]) {
            spikeToPlace = 123;
        } else if (inventoryHas(170)[0]) {
            spikeToPlace = 170;
        } else if (inventoryHas(169)[0]) {
            spikeToPlace = 169;
        } else if (inventoryHas(168)[0]) {
            spikeToPlace = 168;
        } else if (inventoryHas(162)[0]) {
            spikeToPlace = 162;
        } else if (inventoryHas(113)[0]) {
            spikeToPlace = 113;
        }

        if (Settings.AutoSpike.enabled && isAlive() === true && spikeToPlace !== undefined && readys.AutoSpike) {
            readys.AutoSpike = false;
            setTimeout((e) => (readys.AutoSpike = true), 50);

            let pi2 = Math.PI * 2;
            let p = myplayer()
            let angle = p.angle
            if (Settings.AMB.a && Settings.AMB.enabled && HoldWeapon(p.right)) angle = Settings.AMB.a;
            unsafeWindow.wp = p

            let i = Math.floor((((angle + pi2) % pi2) * 255) / pi2)

            send([packets.placeBuild, spikeToPlace, i, 0]);
            for (let inddex = 10; inddex < 30; inddex += 3) {
                send([packets.placeBuild, spikeToPlace, (inddex + i) % 255, 0]);
                send([packets.placeBuild, spikeToPlace, (-inddex + i) % 255, 0]);
            }

        }
    }
}


const Utils = {
    initUI: () => {
        let e = new guify({
            title: "x.x",
            theme: {
                name: "Monryasha",
                colors: {
                    panelBackground: "#00000099",
                    componentBackground: "black",
                    componentForeground: "#00ffcc",
                    textPrimary: "#00ffcc",
                    textSecondary: "#00ffcc",
                    textHover: "black ",
                },
                font: {
                    fontFamily: "Baloo Paaji",
                    fontSize: "20px",
                    fontWeight: "1",
                },
            },
            align: "right",
            width: 550,
            barMode: "none",
            panelMode: "none",
            root: unsafeWindow.container,
            open: !1,
        });
e.Register({
                type: "folder",
                label: "Visuals",
                open: !1,
            }),

        e.Register({
                type: "folder",
                label: "Misc",
                open: !1,
            }),

            e.Register({
                type: "folder",
                label: "Binds",
                open: !1,
            }),
            e.Register({
type:"folder",
label:"Autofarm",
open: !1,
            }),
            e.Register({
                type: "folder",
                label: "PathFinder",
                open: !1,
            }),
e.Register(
                [
                  {
                        type: "checkbox",
                        label: "ColoredSpikes",
                        object: Settings,
                        property: "ColoredSpikes",
                        onChange: (e) => {
                            Utils.saveSettings();
                        },
                    },
                    {
                        type: "checkbox",
                        label: "Roofs Opacity",
                        object: Settings,
                        property: "roofs",
                        onChange: (e) => {
                            Utils.saveSettings();
                        },
                    },
                  {
                        type: "checkbox",
                        label: "Box Info and on top",
                        object: Settings,
                        property: "BoxOnTop",
                        onChange: (e) => {
                            Utils.saveSettings();
                        },
                    },
                    {
                        type: "checkbox",
                        label: "SHOWID",
                        object: Settings,
                        property: "drawID",
                        onChange: (e) => {
                            Utils.saveSettings();
                        },
                    },

                ], {
                    folder: "Visuals",
                }
            ),
            e.Register(
                [{
                        type: "checkbox",
                        label: "AutoExtractor Take",
                        object: Settings.ExtractorSteal,
                        property: "enabled",
                        onChange: (e) => {
                            Utils.saveSettings();
                        },
                    },
                    {
                        type: "checkbox",
                        label: "AutoRespawn",
                        object: Settings.AutoRespawn,
                        property: "enabled",
                        onChange: (e) => {
                            Utils.saveSettings();
                        },
                    },
                    {
                        type: "checkbox",
                        label: "Autocrown",
                        object: Settings.AutoCrown,
                        property: "enabled",
                        onChange: (e) => {
                            Utils.saveSettings();
                        },
                    },
                    {
                        type: "checkbox",
                        label: "AutoExtractor Put",
                        object: Settings.ExtractorPut,
                        property: "enabled",
                        onChange: (e) => {
                            Utils.saveSettings();
                        },
                    },
                    {
                        type: "checkbox",
                        label: "AutoTotem",
                        object: Settings.AutoTotem,
                        property: "enabled",
                        onChange: (e) => {
                            Utils.saveSettings();
                        },
                    },
                    {
                        type: "checkbox",
                        label: "AMB",
                        object: Settings.AMB,
                        property: "enabled",
                        onChange: (e) => {
                            Utils.saveSettings();
                        },
                    },
                    {
                        type: "checkbox",
                        label: "announcer bot",
                        object: Settings,
                        property: "announcer",
                        onChange: (e) => {
                            Utils.saveSettings();
                        },
                    },
                ], {
                    folder: "Misc",
                }
            ),
            e.Register(
                [{
                        type: "button",
                        label: "Set AutoExtractor Put k",
                        action: (e) => {
                            Utils.controls.setKeyBind("ExtractorPut");
                        },
                    },
                    {
                        type: "display",
                        label: "AutoExtractor Put k:",
                        object: Settings.ExtractorPut,
                        property: "key",
                    },
                    {
                        type: "button",
                        label: "Set AutoExtractor Take k",
                        action: (e) => {
                            Utils.controls.setKeyBind("ExtractorSteal");
                        },
                    },
                    {
                        type: "display",
                        label: "AutoExtractor Take k:",
                        object: Settings.ExtractorSteal,
                        property: "key",
                    },

                    {
                        type: "button",
                        label: "Set AutoTotem k",
                        action: (e) => {
                            Utils.controls.setKeyBind("AutoTotem");
                        },
                    },
                    {
                        type: "display",
                        label: "AutoTotem k:",
                        object: Settings.AutoTotem,
                        property: "key",
                    },

                    {
                        type: "button",
                        label: "Set AutoSpike k",
                        action: (e) => {
                            Utils.controls.setKeyBind("AutoSpike");
                        },
                    },
                    {
                        type: "display",
                        label: "AutoSpike k:",
                        object: Settings.AutoSpike,
                        property: "key",
                    },
                    {
                        type: "button",
                        label: "Set AutoCraft k",
                        action: (e) => {
                            Utils.controls.setKeyBind("AutoCraft");
                        },
                    },
                    {
                        type: "display",
                        label: "AutoCraft k:",
                        object: Settings.AutoCraft,
                        property: "key",
                    },
                    {
                        type: "button",
                        label: "Set AutoCraft k",
                        action: (e) => {
                            Utils.controls.setKeyBind("AutoCraft");
                        },
                    },
                    {
                        type: "display",
                        label: "AutoRecycle k:",
                        object: Settings.AutoRecycle,
                        property: "key",
                    },
                    {
                        type: "button",
                        label: "Set AutoRecycle k",
                        action: (e) => {
                            Utils.controls.setKeyBind("AutoRecycle");
                        },
                    },
                    {
                        type: "display",
                        label: "DropSword Put k:",
                        object: Settings.dropsword,
                        property: "key",
                    },
                    {
                        type: "button",
                        label: "Set DropSword k",
                        action: (e) => {
                            Utils.controls.setKeyBind("dropsword");
                        },
                    },
                    {
                        type: "display",
                        label: "AutoSteal k:",
                        object: Settings.AutoSteal,
                        property: "key",
                    },
                    {
                        type: "button",
                        label: "Set AutoSteaL k",
                        action: (e) => {
                            Utils.controls.setKeyBind("AutoSteal");
                        },
                    },
                ], {
                    folder: "Binds",
                }

            ),

 e.Register(
                [{
						type: "checkbox",
						label: "Start Autofarm",
						object: Settings.Autofarm,
						property: "enabled",
						onChange: (e) => {
							Utils.saveSettings();
						},
					},
					{
						type: "checkbox",
						label: "AutoWater",
						object: Settings.Autofarm,
						property: "water",
						onChange: (e) => {
							Utils.saveSettings();
						},
					},
					{
						type: "button",
						label: "Top left of farm",
						action: (e) => {
							let myPlayer = myplayer()

							myPlayer && ((Settings.Autofarm.x = myPlayer.x), (Settings.Autofarm.y = myPlayer.y));
						},
					},
					{
						type: "button",
						label: "Bottom right of farm",
						action: (e) => {
							let myPlayer = myplayer()

							myPlayer && ((Settings.Autofarm.xx = myPlayer.x), (Settings.Autofarm.yy = myPlayer.y));
						},
					},
					{
						type: "button",
						label: "Safe Point",
						action: (e) => {
							let myPlayer = myplayer()

							myPlayer && ((Settings.Autofarm.sx = myPlayer.x), (Settings.Autofarm.sy = myPlayer.y));
						},
					},
					{
						type: "display",
						label: "X",
						object: Settings.Autofarm,
						property: "x",
					},
					{
						type: "display",
						label: "Y",
						object: Settings.Autofarm,
						property: "y",
					},
					{
						type: "display",
						label: "X1",
						object: Settings.Autofarm,
						property: "xx",
					},
					{
						type: "display",
						label: "Y1",
						object: Settings.Autofarm,
						property: "yy",
					},
					{
						type: "display",
						label: "SX",
						object: Settings.Autofarm,
						property: "sx",
					},
					{
						type: "display",
						label: "SY",
						object: Settings.Autofarm,
						property: "sy",
					},
				],
				{
					folder: "Autofarm",
				}
			),

            e.Register(
                [{
                    type: "checkbox",
                    label: "Pathfinder Enabled",
                    folder: "Pathfinder",
                    object: Settings.pathfinder,
                    property: "enabled",
                    onChange() {
                        Utils.saveSettings && Utils.saveSettings()
                    }
                },

                    {
                        type: 'checkbox',
                        label: 'Chase Enemy',
                        object: Settings.pathfinder,
                        property: 'movetoenemy',
                        onChange: data => {
                            Utils.saveSettings();
                        }
                    },

                {
                        type: "checkbox",
                        label: "POD VERIFY",
                        object: Settings.POD,
                        property: "enabled",
                        onChange: (e) => {
                            Utils.saveSettings();
                        },
                    },
                    {
                        type: "checkbox",
                        label: "ZMA VERIFY",
                        object: Settings.ZMA,
                        property: "enabled",
                        onChange: (e) => {
                            Utils.saveSettings();
                        },
                    },
{
                        type: "checkbox",
                        label: "ZMA AFK BYP ",
                        object: Settings.zmaafk,
                        property: "enabled",
                        onChange: (e) => {
                            Utils.saveSettings();
                        },
                    },
                    {
                        type: "range",
                        label: "ChaseID",
                        min: 0,
                        max: 100,
                        step: 1,
                        object: Settings.pathfinder,
                        property: "chaseid",
                        onChange(_) {
                            Utils.saveSettings()
                        }
                    },
                 {
                    type: "display",
                    label: "Pathfinder Key",
                    folder: "Pathfinder",
                    object: Settings.pathfinder,
                    property: "key"
                }, {
                    type: "button",
                    label: "Set Pathfinder Key",
                    folder: "Pathfinder",
                    action() {
                        Utils.controls.setKeyBind("pathfinder")
                    }
                }, {
                    type: "display",
                    label: "Pathfinder X",
                    folder: "Pathfinder",
                    object: Settings.pathfinder,
                    property: "x"
                }, {
                    type: "display",
                    label: "Pathfinder Y",
                    folder: "Pathfinder",
                    object: Settings.pathfinder,
                    property: "y"
                }, {
                    type: "button",
                    label: "Set Current Player Position",
                    folder: "Pathfinder",
                    action() {
                        updatePathfinderPosition && updatePathfinderPosition()
                    }
                },

                {
                    type: "button",
                    label: "Go Back To Lobby",
                    folder: "Pathfinder",
                    action() {
                        let stealtoken = Object.keys(client)[136]
                        client[stealtoken]()
                    }
                },
                 {
                    type: "button",
                    label: "Random Token_ID",
                    folder: "Pathfinder",
                    action() {
                        let stealtoken = Object.keys(user)[14]
                        user[stealtoken] = Gen(5)
                    }
                },
                 ], {
                    folder: "PathFinder",
                }
            );



    },
    controls: null,
    controller: class {
        setKeyBind(callback) {
            Settings[callback].key = "Press any key";
            let click = 0;
            document.addEventListener("keydown", function abc(event) {
                click++;
                if (click >= 1) {
                    if (event.code == "Escape") {
                        Settings[callback].key = "NONE";
                    } else {
                        Settings[callback].key = event.code;
                    }
                    document.removeEventListener("keydown", abc);
                    Utils.saveSettings();
                }
            });
        }
    },
    saveSettings: () => {
        for (let HACK in Settings) {
            localStorage.setItem(HACK + "ZMX", JSON.stringify(Settings[HACK]));
        }
    },
    loadSettings: () => {
        for (let HACK in Settings) {
            let data = localStorage.getItem(HACK);
            if (data) Settings[HACK] = JSON.parse(data);
        }
    },
    LoadHack: () => {
        Utils.loadSettings();
        Utils.controls = new Utils.controller();
        Utils.initUI();
        Utils.saveSettings();

    },
};

unsafeWindow.Utils = Utils

let autoputredsinterval

let awutostealInterval;


document.addEventListener("keydown", (e) => {
    switch (chatxterm() === false && e.code) {
        case Settings.AutoSpike.key:
            Settings.AutoSpike.enabled = true;
            break;
            case Settings.drop.key:
            Settings.drop.enabled = true;
            break;
            case Settings.SwordInchest.key:
            Settings.SwordInchest.enabled = true;
            break;
        case Settings.AutoPutRed.key:
            if (Settings.AutoPutRed.enabled === false) {
                extractorsPut()
                autoputredsinterval = setInterval(autoputred, 100);
            }
            Settings.AutoPutRed.enabled = true
            break;

        case Settings.AMB.key:
            Settings.AMB.enabled = !Settings.AMB.enabled;
            break;

        case Settings.AutoSteal.key:
            if (Settings.AutoSteal.enabled === false) {
                autoSteal1()
                awutostealInterval = setInterval(autoSteal1, 100);
            }
            Settings.AutoSteal.enabled = true;
            break

        case Settings.AutoTotem.key:
            Settings.AutoTotem.enabled = true
            break
        case Settings.dropsword.key:
            Settings.dropsword.enabled = true
            break

    }
});

document.addEventListener("keyup", (e) => {
    switch (chatxterm() === false && e.code) {
        case Settings.AutoSpike.key:
            Settings.AutoSpike.enabled = false;
            break;
            case Settings.drop.key:
            Settings.drop.enabled = false;
            break;
            case Settings.SwordInchest.key:
            Settings.SwordInchest.enabled = false;
            break;
        case Settings.AutoPutRed.key:
            clearInterval(autoputredsinterval)
            Settings.AutoPutRed.enabled = false
            break;
        case Settings.AutoSteal.key:
            clearInterval(awutostealInterval)
            Settings.AutoSteal.enabled = false
            break
        case Settings.AutoTotem.key:
            Settings.AutoTotem.enabled = false
            break
        case Settings.dropsword.key:
            Settings.dropsword.enabled = false
            break

    }
});

function intervals() {
    drawSpshi = setInterval(drawsp, 100)
    assignPidPropNameInterval = setInterval(pid, 100);
    asignedFlyInterval = setInterval(Fly, 100)
    asignedClotheInterval = setInterval(Clothes, 100)
}



function main() {
    auto()
    autoCraft()
    autoBook()
    autoRecycle()
    //Autoeat()
    AutoCrown()
    setInterval(Pathfinder, 200)
    blizzard()
    colors()
    aimbot()
    extractors()
    extractorsPut()
    extractorsInfo()
    drawinchest()
    SwordInChest()
    recycle()
    tot()
    Autosh()
    autofarm()
    Visuals()
    checks()
    healTimer()
    autoresp ()
    checkgame()
    drawID()
    draWBox()
    dropSword()
    nwnh()
    autoputred()
    podid()
}

let ready_ = 0;

function initialize() {
    try {
        if (ready_ === 0 && user !== undefined && world.w !== undefined && client !== undefined) {
            intervals()
            Utils.LoadHack();
            main()
            unsafeWindow.mp = myplayer()
            log("On");
            ready_++;
        }
    } catch (err) {
        log("Off");
        log(err)
    }
}

setInterval(initialize, 200);