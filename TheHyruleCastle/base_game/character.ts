import { Move } from "./move";
import { Tower } from "./tower";
var readline = require('readline-sync');

export class Character {
    protected id: number = Math.floor(Math.random()*10000);
    protected name: string;
    protected hp: number;
    protected hpMax: number;
    protected str: number;
    protected movePool: Array<Move>;

    constructor(name: string, hp: number, hpMax: number, str: number, movePool: Array<Move>) {
        this.name = name;
        this.hp = hp;
        this.hpMax = hpMax;
        this.str = str;
        this.movePool = movePool;
    }

    public getId(){
        return this.id;
    }

    public getHpMax(){
        return this.hpMax;
    }

    public getHp(){
        return this.hp;
    }

    public getName(){
        return this.name;
    }

    public getHit(attack: Move, striker: Character){
        if (attack.getCat() === 'Damage') {
            this.hp = this.hp - attack.getDmg() * striker.str;   
        } else if (attack.getCat() === 'Heal') {
            if (this.hp + Math.floor(this.hpMax/attack.getDmg()) > this.hpMax) {
                this.hp = this.hpMax;
            } else {
                this.hp += Math.floor(this.hpMax/attack.getDmg());
            }
        }
        return true;
    }

    public attack(move: Move, cible: Character){
        if (cible.getHit(move, this)) {
            console.log(`${this.name} use ${move.getName()} and do ${move.getDmg()*this.str} damage on ${cible.getName()} `);
        }
        else{
            return false;
        }
        
    }

    public chooseMove(lvl: Tower){
        console.log("no");
    }

}


export class Hero extends Character {
    private exp: number = 0;
    private items: Array<string>;

    constructor(name: string, hp: number, hpMax: number, str: number, movePool: Array<Move>, items: Array<string>) {
        super(name, hpMax, hp, str, movePool);
        this.items = items;
    }

    public chooseMove(lvl: Tower){
        const movePoolName: Array<string> = [];
        const charName: Array<string> = [];
        for (let i = 0; i < this.movePool.length; i++) {
            movePoolName.push(this.movePool[i].getName());   
        }
        for (let i = 0; i < lvl.getListChar().length; i++) {
            charName.push(lvl.getListChar()[i].getName());
            
        }
        const movei = readline.keyInSelect(movePoolName, `---- Options ----`, {cancel: false});
        const move = this.movePool[movei];
        const ciblei = readline.keyInSelect(charName, `---- Options ----`, {cancel: false});
        const cible = lvl.getListChar()[ciblei];
        this.attack(move, cible);
    }
}

export class Enemy extends Character {
    private rage: boolean = false;
    private items: Array<string>;

    constructor(name: string, hp: number, hpMax:number, str: number, movePool: Array<Move>, items: Array<string>) {
        super(name, hp, hpMax, str, movePool);
        this.items = items;
    }

    public chooseMove(lvl: Tower){
        const movei = Math.floor(Math.random() * this.movePool.length);
        const move = this.movePool[movei];
        if (lvl.getListHe().length !== 0) {
            const ciblei = Math.floor(Math.random() * lvl.getListHe().length);
            const cible = lvl.getListHe()[ciblei];
            this.attack(move, cible);
        }
        else{
            console.log('no one to attack');
        }
    }
}