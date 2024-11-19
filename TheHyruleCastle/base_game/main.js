"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gameLauncher_1 = require("./gameLauncher");
var tower_1 = require("./tower");
var tour = new tower_1.Tower('Ganon\'s Tower');
var gameLauncher = new gameLauncher_1.GameLauncher(tour);
gameLauncher.launcher(tour, gameLauncher);
