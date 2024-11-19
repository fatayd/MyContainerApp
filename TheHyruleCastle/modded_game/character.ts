import { Move } from "./move";
import { Tower } from "./tower";
import { GameLauncher } from "./gameLauncher";
import { Class } from "./class";
import { Consumable, Equipement } from "./equipement";
var readline = require('readline-sync');
const c = require('ansi-colors');

export class Character {
    protected id: number = Math.floor(Math.random()*100);
    protected name: string;
    protected hp: number;
    protected mp: number;
    protected mpMax: number;
    protected int: number;
    protected def: number;
    protected res: number;
    protected spd: number;
    protected luck: number;
    protected race: number;
    protected hpMax: number;
    protected str: number;
    protected movePool: Array<Move>;
    protected sprite: string ;
    protected isProtected: boolean = false;
    protected playedTurn:boolean = false;
    protected effet: Array<Array<string>> = []; 

    constructor(name: string, hp: number, hpMax: number, str: number, movePool: Array<Move>, sprite: string, mp: number, mpMax: number, int: number,
        def: number, res: number, spd: number, luck: number, race: number ) 
    {
        this.name = name;
        this.hp = hp;
        this.hpMax = hpMax;
        this.str = str;
        this.movePool = movePool;
        this.sprite = sprite;
        this.mp = mp;
        this.mpMax = mpMax;
        this.int = int;
        this.def = def;
        this.res = res;
        this.spd = spd;
        this.luck = luck;
        this.race = race;
    }

    public getMp(){
        return this.mp;
    }

    public getEffect(){
        return this.effet;
    }

    public getLuck(){
        return this.luck;
    }

    public getRace(){
        return this.race;
    }

    public setIsProtected(value: boolean){
        this.isProtected = value;
    }

    public getMpMax(){
        return this.mpMax;
    }

    public getSprite(){
        return this.sprite;
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

    public getSpeed(){
        return this.spd;
    }

    public getPlayedTurn(){
        return this.playedTurn;
    }

    public getInt(){
        return this.int;
    }

    public getStr(){
        return this.str;
    }

    public getDef(){
        return this.def;
    }

    public getRes(){
        return this.res;
    }

    public getIsProtected(){
        return this.isProtected;
    }


    public setPlayedTurn(value: boolean){
        this.playedTurn = value;
    }

    public status(game: GameLauncher){
        console.log(':)');

    }

    public getHit(attack: Move, striker: Character){
        if (this.manaCheck(attack, striker)) {
            let damage = attack.getDmg() * striker.damageModifier(this, attack);
            if (attack.getCat() === 'Damage') {
                this.hp = this.hp - Math.floor(damage - (damage*this.defense(attack, this))); 
                this.setIsProtected(false);
                console.log(`${striker.name} use ${attack.getName()} and do `+c.red(Math.floor(damage - (damage*this.defense(attack, this))))+` damage on ${this.getName()} `)  
            } else if (attack.getCat() === 'Heal') {
                if (this.hp + Math.floor(this.hpMax/attack.getDmg()) > this.hpMax) {
                    this.hp = this.hpMax;
                } else {
                    this.hp += Math.floor(this.hpMax/attack.getDmg());
                }
                console.log(`${striker.name} use ${attack.getName()} and do `+c.green(`${Math.floor(this.hpMax/attack.getDmg())}`)+` heal on ${this.getName()} `);
                this.manaCost(attack, striker);
            } else if (attack.getCat() === 'spell') {
                this.hp = this.hp - Math.floor(damage - (damage*this.defense(attack, this)));
                this.manaCost(attack, striker);
                console.log(`${striker.name} launch ${attack.getName()} and do `+c.red(Math.floor(damage - (damage*this.defense(attack, this))))+` damage on ${this.getName()} `);
            } else if (attack.getCat() === 'debuff') {
                this.applyDebuff(attack, this);
                
            }
            this.giveEffect(attack);
            if (this.hp <= 0 && striker instanceof Hero) {
                striker.gainExp(Math.floor(Math.random()*4)+1);
                striker.lvlup();
            }
            return true;    
        }
        return false;
    }

    public defense(move: Move, striker: Character){
        let res: number = 0;
        if (move.getType() === 'physical') {
            res = this.def/100;
        } else if (move.getType() === 'magic') {
            res = this.res/100;
        }
        return res;
    }

    public damageModifier(cible: Character, move: Move){
        let res = 0;
        if (move.getCat() === 'spell') {
            res = this.int;
        } else {
            res = this.str;
        }
        //crit
        let critOdds = Math.floor(Math.random()*100);
        if (critOdds < this.luck){
            res = res*2;
            console.log(`${this.name} make a ` + c.magenta(`CRITICAL HIT !`));
        }
        if (cible.isProtected === true) {
            console.log(c.yellow(`${cible.getName()} se protège`));
            res = res/2;
        }
        return res;
    }

    public applyDebuff(move: Move, cible: Character){
        if (move.getEffect()[0] === 'str') {
            const effect = parseInt(move.getEffect()[1]);
            cible.str += effect;
        } else if (move.getEffect()[0] === 'spd') {
            const effect = parseInt(move.getEffect()[1]);
            cible.spd += effect;
        } else if (move.getEffect()[0] === 'int') {
            const effect = parseInt(move.getEffect()[1]);
            cible.int += effect;
        } else if (move.getEffect()[0] === 'mp') {
            const effect = parseInt(move.getEffect()[1]);
            cible.mp += effect;
        } else if (move.getEffect()[0] === 'luck') {
            const effect = parseInt(move.getEffect()[1]);
            cible.luck += effect;
        } else if (move.getEffect()[0] === 'def') {
            const effect = parseInt(move.getEffect()[1]);
            cible.def += effect;
        } else if (move.getEffect()[0] === 'res') {
            const effect = parseInt(move.getEffect()[1]);
            cible.res += effect;
        }
    }

    public dodgeCheck(cible: Character, move: Move){
        let dodgeChance = cible.getSpeed() - this.spd ;
        if (move.getCat() === 'spell') {
            dodgeChance = cible.getSpeed() - this.spd-5 ;
        }
        if (Math.floor(Math.random()*10) < dodgeChance) {
            console.log(c.yellow(`${this.name} use ${move.getName()}`));
            console.log(c.yellow(`${cible.name} dodge the attack from ${this.name}`));
            return true;
        }
        else {
            return false;
        }
    }

    public manaCost(move: Move, char: Character){
        if (char.mp - move.getMpCost() > 0) {
            char.mp -= move.getMpCost();
        }
        else{
            char.mp = 0;
        }
    }

    public manaCheck(move: Move, char: Character){
        if (char.getMp() - move.getMpCost() >= 0) {
            return true;
        }
        console.log('not enougth mana choose another move');
        return false;
    }

    public attack(move: Move, cible: Character){
        if (!this.dodgeCheck(cible, move)) {
            if (cible.getHit(move, this)) {
                return true
            }
            else{
                return false;
            }
        }
        return true  
    }

    public cleanEffect(){
        this.effet.forEach((effect, i) => {
            if (parseInt(effect[1]) <= 0) {
                if (effect[0] === 'Paralised') {
                    this.applyEffect(['spd','20']);
                    console.log(`${this.name} recover from ${effect[0]} `)
                } else if (effect[0] === 'Sick'){
                    this.applyEffect(['str','4']);
                    this.applyEffect(['def', '20']);
                    console.log(`${this.name} recover from ${effect[0]} `)

                } else if( effect[0] === 'Enraged'){
                    this.applyEffect(['str', '-20']);
                    this.applyEffect(['luck','-20']);
                    this.applyEffect(['int','40']);
                    console.log(`${this.name} recover from ${effect[0]} `)
                }
                this.effet.splice(i,1);
            }
        });
    }

    public checkEffect(effect: Array<Array<string>>){
        effect.forEach((element:Array<string>,i:number) => {
            if (element[0] === 'Burn') {
                this.applyEffect(['hp','-2']);
                console.log(`${this.name} lose 2hp from ${element[0]} `)
                let newDuration = parseInt(element[1])-1;
                effect.splice(i,1,[`${element[0]}`, `${newDuration}`]);
            } else if (element[0] === 'Paralised') {
                this.applyEffect(['spd','-10']);
                console.log(`${this.name} lose 10 spd from ${element[0]} `)
                let newDuration = parseInt(element[1])-1;
                effect.splice(i,1,[`${element[0]}`, `${newDuration}`]);
            } else if (element[0] === 'Sick'){
                this.applyEffect(['str','-2']);
                this.applyEffect(['def', '-10']);
                console.log(`${this.name} lose 2 str 10 def from ${element[0]} `)
                let newDuration = parseInt(element[1])-1;
                effect.splice(i,1,[`${element[0]}`, `${newDuration}`]);
            } else if( element[0] === 'Enraged'){
                this.applyEffect(['str', '10']);
                this.applyEffect(['luck','10']);
                this.applyEffect(['int','-20']);
                console.log(`${this.name} gain 10 str 10 luck and lose 20 int from ${element[0]} `)
                let newDuration = parseInt(element[1])-1;
                effect.splice(i,1,[`${element[0]}`, `${newDuration}`]);
            }
        });
    }

    public giveEffect(move:Move){
        let odds = Math.floor(Math.random()*100);
        if (odds < 40) {
            this.effet.push(move.getEffect());
            if (move.getEffect().length !== 0) {
                console.log(`${this.name} got ${move.getEffect()[0]} for ${move.getEffect()[1]} turn`);
            }
        }
    }

    public applyEffect(effect: Array<string>){
        let stat = effect[0];
        if (stat === "str") {
            this.str += parseInt(effect[1]);
        } if (stat === "spd") {
            this.spd += parseInt(effect[1]);
        } if (stat === "mpMax") {
            this.mpMax += parseInt(effect[1]);
        }if (stat === "def") {
            this.def += parseInt(effect[1]);
        }if (stat === "res") {
            this.res += parseInt(effect[1]);
        }if (stat === "luck") {
            this.luck += parseInt(effect[1]);
        }if (stat === "int") {
            this.int += parseInt(effect[1]);
        }if (stat === "hpMax") {
            this.hpMax += parseInt(effect[1]);
        }if (stat === "mp") {
            if (this.mp + parseInt(effect[1]) > this.mpMax) {
                this.mp = this.mpMax
            }else {
                this.hp += parseInt(effect[1]);
            }
        } if (stat === "hp") {
            if (this.hp + parseInt(effect[1]) > this.hpMax) {
                this.hp = this.hpMax
            }else {
                this.hp += parseInt(effect[1]);
            }
        }
    }

    public speedCheck(){
        let odds = Math.floor(Math.random()*100);
        if (this.spd >= 15 && odds >= 50) {
            console.log(c.yellow(`thanks to its speed ${this.name} gain a bonus action`));
            return true;
        } else if (this.spd >= 12 && odds >= 75) {
            console.log(c.yellow(`thanks to its speed ${this.name} gain a bonus action`));
            return true;
        } else {
            return false;
        }
    }

    public chooseMove(lvl: Tower){
        console.log("no");
        return true;
    }

}


export class Hero extends Character {
    private exp: number = 0;
    private items: Array<Consumable>;
    private equipement: Array<Equipement> = [];
    protected isProtected: boolean = false;
    protected role: Class;


    constructor(name: string, hp: number, hpMax: number, str: number, movePool: Array<Move>, sprite: string, items: Array<Consumable>, mp: number, mpMax: number, int: number,
        def: number, res: number, spd: number, luck: number, race: number, role: Class) {
        super(name, hp, hpMax, str, movePool, sprite, mp, mpMax, int, def, res, spd, luck, race);
        this.items = items;
        this.role = role;
    }

    public gainExp(value: number){
        this.exp += value;
        console.log(c.yellow(`${this.name}`)+` a gagné ${value} exp`)
    }

    public lvlup(){
        if (this.exp >= 10) {
            this.exp = 0;
            let stat = ['str', 'int', 'spd', 'luck', 'hpMax', 'mpMax', 'def', 'res'];
            let augm = readline.keyInSelect(stat, c.yellow('vous avec gagnez un niveau ! quel stat augmenter ?'));
            this.applyEffect([`${stat[augm]}`,`1`]);
            console.log(`votre ${stat[augm]} a augmenté de 1`);
        }
    }

    public status(game: GameLauncher){
        const durationList:Array<string> = [];
        const moveLIst: Array<string> = [];
        const consList: Array<string> = [];
        const eqList: Array<string> = [];
        const effetList:Array<string> = [];
        this.effet.forEach(element => {
            effetList.push(element[0]);
        });
        this.effet.forEach(element => {
            durationList.push(element[1]);
        });
        this.items.forEach(item => {
            consList.push(item.getName())
        });
        this.equipement.forEach(eq => {
            eqList.push(eq.getName());
        });
        this.movePool.forEach(move => {
            moveLIst.push(move.getName());
        });
        console.log(`_____________________________________________________________________________`); 
        console.log(this.sprite);        
        game.displayHealth(this);
        console.log(`STR : ${this.str} INT : ${this.int} DEF : ${this.def} RES : ${this.res} SPD : ${this.spd} LUCK : ${this.luck} RACE : ${this.race} CLASS : ${this.role.name}      |      moves : ${moveLIst.join(' | ')}`);
        console.log(`Inventory : ${consList.join(' | ')} Equipement : ${eqList.join(' | ')} DOT : ${effetList} : ${durationList} `)
        console.log(`_____________________________________________________________________________`);

    }

    public getRole(){
        return this.role;
    }

    public getEquipement(){
        return this.equipement;
    }

    public addEquipment(eq: Equipement){
        this.equipement.push(eq);
    }

    public chooseMove(lvl: Tower): boolean{
        const movePoolName: Array<string> = [];
        const charName: Array<string> = [];
        for (let i = 0; i < this.movePool.length; i++) {
            movePoolName.push(this.movePool[i].getName());   
        }
        for (let i = 0; i < lvl.getListChar().length; i++) {
            if (lvl.getListChar()[i] instanceof Hero) {
                charName.push(c.yellow(`${lvl.getListChar()[i].getName()}`)+ c.cyan(` ${lvl.getListChar()[i].getHp()}/${lvl.getListChar()[i].getHpMax()}`));
            } else{
                charName.push(c.red(`${lvl.getListChar()[i].getName()}`)+ c.magenta(` ${lvl.getListChar()[i].getHp()}/${lvl.getListChar()[i].getHpMax()}`));
            }
            
        }
        const movei = readline.keyInSelect(movePoolName, `---- tour de ${this.name} ----`);
        if (movei !== -1) {
            const move = this.movePool[movei];
            const ciblei = readline.keyInSelect(charName, `---- tour de ${this.name} ----`);
            const cible = lvl.getListChar()[ciblei];
            if (movei !== -1 && ciblei !== -1) {
                if (move.getCat() === 'protection') {
                    cible.setIsProtected(true);
                    return true;
                } else {
                    return this.attack(move, cible);
                }
            }
        }
        return false;
    }

    restoreMp(){
        if (this.mp + Math.floor(this.mpMax/10) > this.mpMax) {
            this.mp = this.mpMax;
        } else {
            this.mp += Math.floor(this.mpMax/10);
        }
    }

    restoreHp(){
        if (this.hp + Math.floor(this.hpMax/5) > this.hpMax) {
            this.hp = this.hpMax;
        }else{
            this.hp += Math.floor(this.hpMax/5);
        }   
    }

    public applyClass(val: boolean){
        const spMove = new Move(this.role.specialMove.dmg, this.role.specialMove.name, this.role.specialMove.category, this.role.specialMove.MpCost, this.role.specialMove.Type, this.role.specialMove.effect, this.role.name);
        this.movePool.push(spMove);
        if (val) {
            this.role.bonus.forEach(stat => {
                if (stat === "str") {
                    this.str += 5;
                } if (stat === "spd") {
                    this.spd += 5;
                } if (stat === "mpMax") {
                    this.mpMax += 5;
                }if (stat === "def") {
                    this.def += 5;
                }if (stat === "res") {
                    this.res += 5;
                }if (stat === "luck") {
                    this.luck += 5;
                }if (stat === "int") {
                    this.int += 5;
                }if (stat === "hpMax") {
                    this.hpMax += 5;
                }
            });
        }
    }

    public getItems(){
        return this.items
    }

    public addConsumable(item: Consumable){
        this.items.push(item);
    }

    public equipItem(equipement: Equipement){
        let i = 0;
        if (this.equipement.length !== 0) {
            while (i < this.equipement.length && this.equipement.length === 0 || equipement.type !== this.equipement[i].type ) {
            i++;
            }
            if (i === this.equipement.length) {
                console.log(`${equipement.name} equiped`);
                this.equipement.push(equipement);
                equipement.effect.forEach(ef => {
                    this.applyEffect(ef);
                });
            } else {
                if(readline.keyInYN(`would you like to replace your ${this.equipement[i].getName()} by ${equipement.name}`)){
                    this.exchangeEquipement(equipement);
                } else {
                    console.log('you didn\'t replace it');
                }
    
            }
        } else {
            console.log(`${equipement.name} equiped`);
            this.equipement.push(equipement);
            equipement.effect.forEach(ef => {
                this.applyEffect(ef);
            });
        }
        
    }

    public exchangeEquipement(equipement: Equipement){
        let i = 0;
        while (equipement.type !== this.equipement[i].type && i < this.equipement.length) {
            i ++;
        }
        if (i === this.equipement.length) {
            console.log(`no ${equipement.type} found`);
        } else {
            this.equipement[i].getEffect().forEach(element => {
                let inverser = parseInt(element[1])*(-1);
                let disapply = [element[0],`${inverser}`];
                this.applyEffect(disapply);
            });
                this.equipement.splice(i,1, equipement);
                console.log(`${equipement.name} equiped`);
                this.equipement.push(equipement);
                equipement.effect.forEach(ef => {
                this.applyEffect(ef);
            });
        }
    }

    public printInventory(){
        let inventoryName: Array<string> = [];
        this.items.forEach(element => {
            inventoryName.push(element.getName());
        });
        const ans = readline.keyInSelect(inventoryName, '-------- INVENTORY --------');
        return ans;
    }

    public cleanInventory(){
        this.items.forEach((element, i) => {
            if (element.expired) {
                this.items.splice(i,1);
            }
        });
    }

    public useConsumable(item: Consumable){
        if (!item.expired) {
            item.effect.forEach(element => {
                this.applyEffect(element);
            });
            item.isExpired();
            this.cleanInventory();
        } else {
            console.log(`already used item`);
        }
        
    }

    
}

export class Enemy extends Character {
    private rage: boolean = false;
    private items: Array<string>;
    protected isProtected: boolean = false;

    constructor(name: string, hp: number, hpMax:number, str: number, movePool: Array<Move>, sprite: string, items: Array<string>, mp: number, mpMax: number, int: number,
        def: number, res: number, spd: number, luck: number, race: number) {
        super(name, hp, hpMax, str, movePool, sprite, mp, mpMax, int, def, res, spd, luck, race);
        this.items = items;
    }

    public chooseMove(lvl: Tower){
        const movei = Math.floor(Math.random() * this.movePool.length);
        const move = this.movePool[movei];
        if (lvl.getListHe().length !== 0) {
            const ciblei = Math.floor(Math.random() * lvl.getListHe().length);
            const cible = lvl.getListHe()[ciblei];
            return this.attack(move, cible);
        }
        else{
            console.log('eating your corpses');
            return false;
        }
    }

    public status(game: GameLauncher){
        const moveLIst: Array<string> = [];
        const effetList:Array<string> = [];
        this.effet.forEach(element => {
            effetList.push(element[0]);
        });
        this.movePool.forEach(move => {
            moveLIst.push(move.getName());
        });         
        console.log(`_____________________________________________________________________________`);
        console.log(this.sprite); 
        game.displayHealth(this);
        console.log(`STR : ${this.str} INT : ${this.int} DEF : ${this.def} RES : ${this.res} SPD : ${this.spd} RACE : ${this.race}      |      moves : ${moveLIst.join(' ')}`);
        console.log(`DOT : ${effetList}`)
        console.log(`_____________________________________________________________________________`);

    }
}