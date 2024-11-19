"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enemy = exports.Hero = exports.Character = void 0;
var readline = require('readline-sync');
var Character = /** @class */ (function () {
    function Character(name, hp, hpMax, str, movePool) {
        this.id = Math.floor(Math.random() * 10000);
        this.name = name;
        this.hp = hp;
        this.hpMax = hpMax;
        this.str = str;
        this.movePool = movePool;
    }
    Character.prototype.getId = function () {
        return this.id;
    };
    Character.prototype.getHpMax = function () {
        return this.hpMax;
    };
    Character.prototype.getHp = function () {
        return this.hp;
    };
    Character.prototype.getName = function () {
        return this.name;
    };
    Character.prototype.getHit = function (attack, striker) {
        if (attack.getCat() === 'Damage') {
            this.hp = this.hp - attack.getDmg() * striker.str;
        }
        else if (attack.getCat() === 'Heal') {
            if (this.hp + Math.floor(this.hpMax / attack.getDmg()) > this.hpMax) {
                this.hp = this.hpMax;
            }
            else {
                this.hp += Math.floor(this.hpMax / attack.getDmg());
            }
        }
        return true;
    };
    Character.prototype.attack = function (move, cible) {
        if (cible.getHit(move, this)) {
            console.log("".concat(this.name, " use ").concat(move.getName(), " and do ").concat(move.getDmg() * this.str, " damage on ").concat(cible.getName(), " "));
        }
        else {
            return false;
        }
    };
    Character.prototype.chooseMove = function (lvl) {
        console.log("no");
    };
    return Character;
}());
exports.Character = Character;
var Hero = /** @class */ (function (_super) {
    __extends(Hero, _super);
    function Hero(name, hp, hpMax, str, movePool, items) {
        var _this = _super.call(this, name, hpMax, hp, str, movePool) || this;
        _this.exp = 0;
        _this.items = items;
        return _this;
    }
    Hero.prototype.chooseMove = function (lvl) {
        var movePoolName = [];
        var charName = [];
        for (var i = 0; i < this.movePool.length; i++) {
            movePoolName.push(this.movePool[i].getName());
        }
        for (var i = 0; i < lvl.getListChar().length; i++) {
            charName.push(lvl.getListChar()[i].getName());
        }
        var movei = readline.keyInSelect(movePoolName, "---- Options ----", { cancel: false });
        var move = this.movePool[movei];
        var ciblei = readline.keyInSelect(charName, "---- Options ----", { cancel: false });
        var cible = lvl.getListChar()[ciblei];
        this.attack(move, cible);
    };
    return Hero;
}(Character));
exports.Hero = Hero;
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    function Enemy(name, hp, hpMax, str, movePool, items) {
        var _this = _super.call(this, name, hp, hpMax, str, movePool) || this;
        _this.rage = false;
        _this.items = items;
        return _this;
    }
    Enemy.prototype.chooseMove = function (lvl) {
        var movei = Math.floor(Math.random() * this.movePool.length);
        var move = this.movePool[movei];
        if (lvl.getListHe().length !== 0) {
            var ciblei = Math.floor(Math.random() * lvl.getListHe().length);
            var cible = lvl.getListHe()[ciblei];
            this.attack(move, cible);
        }
        else {
            console.log('no one to attack');
        }
    };
    return Enemy;
}(Character));
exports.Enemy = Enemy;
