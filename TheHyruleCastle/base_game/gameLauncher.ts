import { Tower } from "./tower";
import { Character, Enemy } from "./character";
import { Hero } from "./character";
import { Move } from "./move";
import { readFile } from "fs";
import { BADHINTS } from "dns";
const c = require('ansi-colors');
var fs = require('fs');
var readline = require('readline-sync');


export class GameLauncher{
    private tower: Tower;
    private continue: boolean = true;
    private movesJson = JSON.parse(fs.readFileSync('./moves.json', 'utf-8'));
    private enemieJson = JSON.parse(fs.readFileSync('./enemies.json', 'utf-8'));
    private playerJson = JSON.parse(fs.readFileSync('./players.json', 'utf-8'));
    private bossJson = JSON.parse(fs.readFileSync('./bosses.json', 'utf-8'));

    constructor(tower: Tower){
        this.tower = tower;
    }

    public gameStart(){
        this.generateHero();
        this.generateEnemy();
    }

    public raritySort(cat: string){
        let rarity = Math.floor(Math.random()*101);
        if (rarity <= 50) {
            rarity = 1;
        } else if (rarity < 80) {
            rarity = 2;
        } else if (rarity < 95) {
            rarity = 3;
        }else if (rarity < 99) {
            rarity = 4;
        } else{
            rarity = 5;
        }
        let res= [];
        if (cat === 'Boss') {
            for (let i = 0; i < this.bossJson.length; i++) {
                if (this.bossJson[i].rarity === rarity) {
                    res.push(this.bossJson[i]);
                }
                
            }
        } else if (cat === 'Enemy') {
            for (let i = 0; i < this.enemieJson.length; i++) {
                if (this.enemieJson[i].rarity === rarity) {
                    res.push(this.enemieJson[i]);
                }
                
            } 
        } else if (cat === 'Hero') {
            for (let i = 0; i < this.playerJson.length; i++) {
                if (this.playerJson[i].rarity === rarity) {
                    res.push(this.playerJson[i]);
                }
                
            } 
        }
        const char = res[Math.floor(Math.random()*res.length)];
        return char;
    }


    public generateEnemy(){ 
        let enemyMoves: Array<Move> = [];
        let enemie = this.raritySort('Enemy');
        for (let i = 0; i < this.movesJson.length; i++) {
            if (this.movesJson[i].category === 'Damage') { 
                const move = new Move(this.movesJson[i].dmg, this.movesJson[i].name, this.movesJson[i].category);               
                enemyMoves.push(move);
            }  
        }
        const enemy = new Enemy(enemie.name, enemie.hp,enemie.hp, enemie.str, enemyMoves, []);
        this.tower.createFloor([enemy]);

    }

    public generateHero(){
        let heroMoves: Array<Move> = [];
        let player = this.raritySort('Hero');
        for (let i = 0; i < this.movesJson.length; i++) {
            const move = new Move(this.movesJson[i].dmg, this.movesJson[i].name, this.movesJson[i].category);
            heroMoves.push(move);  
        }
        const hero = new Hero(player.name, player.hp, player.hp, player.str, heroMoves, []);
        this.tower.addHero(hero);

    }

    public generateBosses(){
        let enemyMoves: Array<Move> = [];
        let boss = this.raritySort('Boss');
        for (let i = 0; i < this.movesJson.length; i++) {
            if (this.movesJson[i].category === 'Damage') { 
                const move = new Move(this.movesJson[i].dmg, this.movesJson[i].name, this.movesJson[i].category);               
                enemyMoves.push(move);
            }  
        }
        const enemy = new Enemy(boss.name, boss.hp, boss.hp, boss.str, enemyMoves, []);
        this.tower.createFloor([enemy]);

    }


    public gameLoop(){
        while (!this.tower.gameOver()) {
            while (!this.tower.nexLvl() && !this.tower.gameOver()) {
                console.log(`========== floor ${this.tower.getLvl()} ==========`);
                for (let i = 0; i < this.tower.getlistEn().length; i++) {
                    this.displayHealth(this.tower.getlistEn()[i]);   
                }
                for (let i = 0; i < this.tower.getListHe().length; i++) {
                    this.displayHealth(this.tower.getListHe()[i]);   
                }
                // choix attaque ou item ou status

                // choix de l'attaque
                for (let i = 0; i < this.tower.getListChar().length; i++) {
                    this.tower.getListChar()[i].chooseMove(this.tower);
                    this.tower.deleteChar();
                }
            }
            if (this.tower.nexLvl() && this.tower.getLvl() < 9) {
                this.generateEnemy();
            } else if (this.tower.nexLvl() && this.tower.getLvl() === 9) {
                this.generateBosses();
            } else if (this.tower.nexLvl() && this.tower.getLvl() > 9){
                console.log('VICTORY');
                this.tower.exit();
            }
        }
        this.tower.exit();
        
    }

    public displayHealth(char: Character){
        let barre: string = '';
        for (let i = 0; i < char.getHp(); i++) {
            barre += 'I';
        }
        for (let i = 0; i < char.getHpMax() - char.getHp(); i++) {
            barre += '_';
            
        }
        if (char instanceof Hero) {
            console.log(c.cyan(char.getName()));
        } else if (char instanceof Enemy) {
            console.log(c.magenta(char.getName()));
        }
        if (char.getHp() > Math.floor(char.getHpMax()/2)) {
            console.log(`HP `+c.green(`${barre}`)+` ${char.getHp()}`);
        } else if (char.getHp() <= Math.floor(char.getHpMax()/2) && char.getHp() > Math.floor(char.getHpMax()/4)) {
            console.log(`HP `+c.yellow(`${barre}`)+` ${char.getHp()}`);
        } else {
            console.log(`HP `+c.red(`${barre}`)+` ${char.getHp()}`);
        }
    }

    public launcher(tower: Tower, gamelauncher: GameLauncher){
        while (gamelauncher.continue === true) {
            console.log(c.magenta(`      \r\n                                       \/@\r\n                       __        __   \/\\\/\r\n                      \/==\\      \/  \\_\/\\\/   \r\n                    \/======\\    \\\/\\__ \\__\r\n                  \/==\/\\  \/\\==\\    \/\\_|__ \\\r\n               \/==\/    ||    \\=\\ \/ \/ \/ \/_\/\r\n             \/=\/    \/\\ || \/\\   \\=\\\/ \/     \r\n          \/===\/   \/   \\||\/   \\   \\===\\\r\n        \/===\/   \/_________________ \\===\\\r\n     \/====\/   \/ |                \/  \\====\\\r\n   \/====\/   \/   |  _________    \/  \\   \\===\\    THE LEGEND OF \r\n   \/==\/   \/     | \/   \/  \\ \/ \/ \/  __________\\_____      ______       ___\r\n  |===| \/       |\/   \/____\/ \/ \/   \\   _____ |\\   \/      \\   _ \\      \\  \\\r\n   \\==\\             \/\\   \/ \/ \/     | |  \/= \\| | |        | | \\ \\     \/ _ \\\r\n   \\===\\__    \\    \/  \\ \/ \/ \/   \/  | | \/===\/  | |        | |  \\ \\   \/ \/ \\ \\\r\n     \\==\\ \\    \\\\ \/____\/   \/_\\ \/\/  | |_____\/| | |        | |   | | \/ \/___\\ \\\r\n     \\===\\ \\   \\\\\\\\\\\\\\\/   \/\/\/\/\/\/\/ \/|  _____ | | |        | |   | | |  ___  |\r\n       \\==\\\/     \\\\\\\\\/ \/ \/\/\/\/\/\/   \\| |\/==\/ \\| | |        | |   | | | \/   \\ |\r\n       \\==\\     _ \\\\\/ \/ \/\/\/\/\/    _ | |==\/     | |        | |  \/ \/  | |   | |\r\n         \\==\\  \/ \\ \/ \/ \/\/\/      \/|\\| |_____\/| | |_____\/| | |_\/ \/   | |   | |\r\n         \\==\\ \/   \/ \/ \/________\/ |\/_________|\/_________|\/_____\/   \/___\\ \/___\\\r\n           \\==\\  \/               | \/==\/\r\n           \\=\\  \/________________|\/=\/    \r\n             \\==\\     _____     \/==\/ \r\n            \/ \\===\\   \\   \/   \/===\/\r\n           \/ \/ \/\\===\\  \\_\/  \/===\/\r\n          \/ \/ \/   \\====\\ \/====\/\r\n         \/ \/ \/      \\===|===\/\r\n         |\/_\/         \\===\/\r\n                        =  `));
            let exit = readline.question('              press start to continue\n');
            if (exit === 'quit') {
                gamelauncher.continue = false;
            } else {
                gamelauncher.gameStart();
                gamelauncher.gameLoop();
                if (tower.gameOver()) {
                    console.log('Try again the kingdom needs you');
                } 
            }
        }
    }

}

