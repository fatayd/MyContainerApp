"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameLauncher = void 0;
var character_1 = require("./character");
var character_2 = require("./character");
var move_1 = require("./move");
var c = require('ansi-colors');
var fs = require('fs');
var readline = require('readline-sync');
var GameLauncher = /** @class */ (function () {
    function GameLauncher(tower) {
        this.continue = true;
        this.movesJson = JSON.parse(fs.readFileSync('./moves.json', 'utf-8'));
        this.enemieJson = JSON.parse(fs.readFileSync('./enemies.json', 'utf-8'));
        this.playerJson = JSON.parse(fs.readFileSync('./players.json', 'utf-8'));
        this.bossJson = JSON.parse(fs.readFileSync('./bosses.json', 'utf-8'));
        this.tower = tower;
    }
    GameLauncher.prototype.gameStart = function () {
        this.generateHero();
        this.generateEnemy();
    };
    GameLauncher.prototype.raritySort = function (cat) {
        var rarity = Math.floor(Math.random() * 101);
        if (rarity <= 50) {
            rarity = 1;
        }
        else if (rarity < 80) {
            rarity = 2;
        }
        else if (rarity < 95) {
            rarity = 3;
        }
        else if (rarity < 99) {
            rarity = 4;
        }
        else {
            rarity = 5;
        }
        var res = [];
        if (cat === 'Boss') {
            for (var i = 0; i < this.bossJson.length; i++) {
                if (this.bossJson[i].rarity === rarity) {
                    res.push(this.bossJson[i]);
                }
            }
        }
        else if (cat === 'Enemy') {
            for (var i = 0; i < this.enemieJson.length; i++) {
                if (this.enemieJson[i].rarity === rarity) {
                    res.push(this.enemieJson[i]);
                }
            }
        }
        else if (cat === 'Hero') {
            for (var i = 0; i < this.playerJson.length; i++) {
                if (this.playerJson[i].rarity === rarity) {
                    res.push(this.playerJson[i]);
                }
            }
        }
        var char = res[Math.floor(Math.random() * res.length)];
        return char;
    };
    GameLauncher.prototype.generateEnemy = function () {
        var enemyMoves = [];
        var enemie = this.raritySort('Enemy');
        for (var i = 0; i < this.movesJson.length; i++) {
            if (this.movesJson[i].category === 'Damage') {
                var move = new move_1.Move(this.movesJson[i].dmg, this.movesJson[i].name, this.movesJson[i].category);
                enemyMoves.push(move);
            }
        }
        var enemy = new character_1.Enemy(enemie.name, enemie.hp, enemie.hp, enemie.str, enemyMoves, []);
        this.tower.createFloor([enemy]);
    };
    GameLauncher.prototype.generateHero = function () {
        var heroMoves = [];
        var player = this.raritySort('Hero');
        for (var i = 0; i < this.movesJson.length; i++) {
            var move = new move_1.Move(this.movesJson[i].dmg, this.movesJson[i].name, this.movesJson[i].category);
            heroMoves.push(move);
        }
        var hero = new character_2.Hero(player.name, player.hp, player.hp, player.str, heroMoves, []);
        this.tower.addHero(hero);
    };
    GameLauncher.prototype.generateBosses = function () {
        var enemyMoves = [];
        var boss = this.raritySort('Boss');
        for (var i = 0; i < this.movesJson.length; i++) {
            if (this.movesJson[i].category === 'Damage') {
                var move = new move_1.Move(this.movesJson[i].dmg, this.movesJson[i].name, this.movesJson[i].category);
                enemyMoves.push(move);
            }
        }
        var enemy = new character_1.Enemy(boss.name, boss.hp, boss.hp, boss.str, enemyMoves, []);
        this.tower.createFloor([enemy]);
    };
    GameLauncher.prototype.gameLoop = function () {
        while (!this.tower.gameOver()) {
            while (!this.tower.nexLvl() && !this.tower.gameOver()) {
                console.log("========== floor ".concat(this.tower.getLvl(), " =========="));
                for (var i = 0; i < this.tower.getlistEn().length; i++) {
                    this.displayHealth(this.tower.getlistEn()[i]);
                }
                for (var i = 0; i < this.tower.getListHe().length; i++) {
                    this.displayHealth(this.tower.getListHe()[i]);
                }
                // choix attaque ou item ou status
                // choix de l'attaque
                for (var i = 0; i < this.tower.getListChar().length; i++) {
                    this.tower.getListChar()[i].chooseMove(this.tower);
                    this.tower.deleteChar();
                }
            }
            if (this.tower.nexLvl() && this.tower.getLvl() < 9) {
                this.generateEnemy();
            }
            else if (this.tower.nexLvl() && this.tower.getLvl() === 9) {
                this.generateBosses();
            }
            else if (this.tower.nexLvl() && this.tower.getLvl() > 9) {
                console.log('VICTORY');
                this.tower.exit();
            }
        }
        this.tower.exit();
    };
    GameLauncher.prototype.displayHealth = function (char) {
        var barre = '';
        for (var i = 0; i < char.getHp(); i++) {
            barre += 'I';
        }
        for (var i = 0; i < char.getHpMax() - char.getHp(); i++) {
            barre += '_';
        }
        if (char instanceof character_2.Hero) {
            console.log(c.cyan(char.getName()));
        }
        else if (char instanceof character_1.Enemy) {
            console.log(c.magenta(char.getName()));
        }
        if (char.getHp() > Math.floor(char.getHpMax() / 2)) {
            console.log("HP " + c.green("".concat(barre)) + " ".concat(char.getHp()));
        }
        else if (char.getHp() <= Math.floor(char.getHpMax() / 2) && char.getHp() > Math.floor(char.getHpMax() / 4)) {
            console.log("HP " + c.yellow("".concat(barre)) + " ".concat(char.getHp()));
        }
        else {
            console.log("HP " + c.red("".concat(barre)) + " ".concat(char.getHp()));
        }
    };
    GameLauncher.prototype.launcher = function (tower, gamelauncher) {
        while (gamelauncher.continue === true) {
            console.log(c.magenta("      \r\n                                       /@\r\n                       __        __   /\\/\r\n                      /==\\      /  \\_/\\/   \r\n                    /======\\    \\/\\__ \\__\r\n                  /==/\\  /\\==\\    /\\_|__ \\\r\n               /==/    ||    \\=\\ / / / /_/\r\n             /=/    /\\ || /\\   \\=\\/ /     \r\n          /===/   /   \\||/   \\   \\===\\\r\n        /===/   /_________________ \\===\\\r\n     /====/   / |                /  \\====\\\r\n   /====/   /   |  _________    /  \\   \\===\\    THE LEGEND OF \r\n   /==/   /     | /   /  \\ / / /  __________\\_____      ______       ___\r\n  |===| /       |/   /____/ / /   \\   _____ |\\   /      \\   _ \\      \\  \\\r\n   \\==\\             /\\   / / /     | |  /= \\| | |        | | \\ \\     / _ \\\r\n   \\===\\__    \\    /  \\ / / /   /  | | /===/  | |        | |  \\ \\   / / \\ \\\r\n     \\==\\ \\    \\\\ /____/   /_\\ //  | |_____/| | |        | |   | | / /___\\ \\\r\n     \\===\\ \\   \\\\\\\\\\\\\\/   /////// /|  _____ | | |        | |   | | |  ___  |\r\n       \\==\\/     \\\\\\\\/ / //////   \\| |/==/ \\| | |        | |   | | | /   \\ |\r\n       \\==\\     _ \\\\/ / /////    _ | |==/     | |        | |  / /  | |   | |\r\n         \\==\\  / \\ / / ///      /|\\| |_____/| | |_____/| | |_/ /   | |   | |\r\n         \\==\\ /   / / /________/ |/_________|/_________|/_____/   /___\\ /___\\\r\n           \\==\\  /               | /==/\r\n           \\=\\  /________________|/=/    \r\n             \\==\\     _____     /==/ \r\n            / \\===\\   \\   /   /===/\r\n           / / /\\===\\  \\_/  /===/\r\n          / / /   \\====\\ /====/\r\n         / / /      \\===|===/\r\n         |/_/         \\===/\r\n                        =  "));
            var exit = readline.question('              press start to continue\n');
            if (exit === 'quit') {
                gamelauncher.continue = false;
            }
            else {
                gamelauncher.gameStart();
                gamelauncher.gameLoop();
                if (tower.gameOver()) {
                    console.log('Try again the kingdom needs you');
                }
            }
        }
    };
    return GameLauncher;
}());
exports.GameLauncher = GameLauncher;
