"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tower = void 0;
var character_1 = require("./character");
var character_2 = require("./character");
var Tower = /** @class */ (function () {
    function Tower(name) {
        this.lvl = 0;
        this.listChar = [];
        this.listEn = [];
        this.listHe = [];
        this.name = name;
    }
    //  à supprimer
    Tower.prototype.exit = function () {
        this.listChar = [];
        this.listEn = [];
        this.listHe = [];
        this.lvl = 0;
    };
    Tower.prototype.getLvl = function () {
        return this.lvl;
    };
    Tower.prototype.getListChar = function () {
        return this.listChar;
    };
    Tower.prototype.getlistEn = function () {
        return this.listEn;
    };
    Tower.prototype.getListHe = function () {
        return this.listHe;
    };
    Tower.prototype.gameOver = function () {
        if (this.listHe.length === 0) {
            return true;
        }
        return false;
    };
    Tower.prototype.nexLvl = function () {
        if (this.listEn.length === 0) {
            return true;
        }
        return false;
    };
    Tower.prototype.deleteChar = function () {
        for (var i = 0; i < this.getListChar().length; i++) {
            if (this.listChar[i].getHp() <= 0) {
                var id = this.listChar[i].getId();
                if (this.listChar[i] instanceof character_1.Hero) {
                    for (var i_1 = 0; i_1 < this.listHe.length; i_1++) {
                        if (this.listHe[i_1].getId() === id) {
                            this.listHe.splice(i_1, 1);
                        }
                    }
                }
                else if (this.listChar[i] instanceof character_2.Enemy) {
                    for (var i_2 = 0; i_2 < this.listEn.length; i_2++) {
                        if (this.listEn[i_2].getId() === id) {
                            this.listEn.splice(i_2, 1);
                        }
                    }
                }
                this.listChar.splice(i, 1);
            }
        }
    };
    Tower.prototype.createFloor = function (enemyList) {
        for (var i = 0; i < enemyList.length; i++) {
            this.listEn.push(enemyList[i]);
            this.listChar.push(enemyList[i]);
        }
        this.lvl += 1;
    };
    Tower.prototype.addHero = function (hero) {
        this.listHe.push(hero);
        this.listChar.push(hero);
    };
    return Tower;
}());
exports.Tower = Tower;
