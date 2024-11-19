"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Move = void 0;
var Move = /** @class */ (function () {
    function Move(dmg, name, cat) {
        this.dmg = dmg;
        this.name = name;
        this.cat = cat;
    }
    Move.prototype.getDmg = function () {
        return this.dmg;
    };
    Move.prototype.getName = function () {
        return this.name;
    };
    Move.prototype.getCat = function () {
        return this.cat;
    };
    return Move;
}());
exports.Move = Move;
