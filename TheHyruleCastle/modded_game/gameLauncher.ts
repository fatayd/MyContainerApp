import { Tower } from "./tower";
import { Character, Enemy } from "./character";
import { Hero } from "./character";
import { Move } from "./move";
import { Class } from "./class";
import { Save } from "./save";
import { Consumable, Equipement, Item } from "./equipement";
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
    private classJson = JSON.parse(fs.readFileSync('./class.json', 'utf-8'));
    private lootJson = JSON.parse(fs.readFileSync('./loot.json', 'utf-8'));
    private save: Save = new Save([]);
    

    constructor(tower: Tower){
        this.tower = tower;
    }

    public gameStart(){
        this.generateHero();
        this.generateEnemy();
    }

    public difficultyChoice(){
        const choice: Array<string>= ['Normal', 'Difficult', 'Ganon\'s challenge'];
        const choiceI = readline.keyInSelect(choice, '');
        if (choiceI === 1) {
            this.tower.setDifficulty(1.5);
        } else if (choiceI === 2) {
            this.tower.setDifficulty(2); 
        }
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
        }
        const char = res[Math.floor(Math.random()*res.length)];
        return char;
    }

    public runAway(){
        const odds = Math.floor(Math.random()*100);
        const originalLength = this.tower.getListChar().length
        if (odds <= 5) {
            this.generateBosses().forEach(element => {
                this.tower.addEnemy(element);
            });
            for (let i = 0; i < this.tower.getListChar().length-(this.tower.getListChar().length - originalLength); i++) {
                if (this.tower.getListChar()[i] instanceof Enemy) {
                    this.tower.delEnemy(i);
                }
            }
            console.log('terrible odds has fell on you');
        } else {
            this.generateEnemy().forEach(element => {
                this.tower.addEnemy(element);
            });
            for (let i = 0; i < this.tower.getListChar().length-(this.tower.getListChar().length - originalLength); i++) {
                if (this.tower.getListChar()[i] instanceof Enemy) {
                    this.tower.delEnemy(i);
                }
            }
        }
        if (this.tower.getLvl() - 5 > 0) {
            this.tower.setLvl(this.tower.getLvl() - Math.floor(Math.random()*6));
        } else {
            this.tower.setLvl(0);
        }
        console.log('you will flee to lower floors after the next turn');
    }

    public generateEnemy(){ 
        let list: Array<Enemy> = [];
        for (let i = 0; i < Math.floor(Math.random()*6+1); i++) {
            let enemyMoves: Array<Move> = [];
            let enemie = this.raritySort('Enemy');
            for (let i = 0; i < this.movesJson.length; i++) {
                if (this.movesJson[i].category === 'Damage' && (this.movesJson[i].user === 'all' || this.movesJson[i].user === 'Monster')) { 
                    const move = new Move(this.movesJson[i].dmg, this.movesJson[i].name, this.movesJson[i].category, this.movesJson[i].MpCost, this.movesJson[i].Type, this.movesJson[i].effect, this.movesJson[i].user);               
                    enemyMoves.push(move);
                }  
            }
            const enemy = new Enemy(enemie.name, Math.floor(enemie.hp*this.tower.getDifficulty()),Math.floor(enemie.hp*this.tower.getDifficulty()), Math.floor(enemie.str*this.tower.getDifficulty()), enemyMoves, enemie.sprite, [], enemie.mp, enemie.mp, 
                enemie.int, enemie.def, enemie.res, enemie.spd, Math.floor(enemie.luck*this.tower.getDifficulty()), enemie.race);
            list.push(enemy);
            
        }
        return(list);
    }

    public generateClass(){
        let classList: Array<Class> = [];
        this.classJson.forEach((role:Class) => {
            const newRole = new Class(role.name, role.bonus, role.specialMove);
            classList.push(newRole);
        });

        return classList;
    }


    public generateHero(){
        let heroMoves: Array<Move> = [];
        let heroList: Array<Hero> = [];
        let heroListname: Array<string> = [];
        let roleList = this.generateClass();
        let roleListname: Array<string> = [];
        for (let i = 0; i < roleList.length; i++) {
            roleListname.push(roleList[i].name);
            
        }
        for (let i = 0; i < 2; i++) {
            console.log('============= CHOOSE A CLASS =============')
            let chosenRole = readline.keyInSelect(roleListname, '---- a class will define how you fight ----', {cancel : false});
            for (let i = 0; i < this.movesJson.length; i++) {
                console.log(this.movesJson[i].user);
                if (this.movesJson[i].user === 'all' || this.movesJson[i].user === 'Hero') {
                    const move = new Move(this.movesJson[i].dmg, this.movesJson[i].name, this.movesJson[i].category, this.movesJson[i].MpCost, this.movesJson[i].Type, this.movesJson[i].effect, this.movesJson[i].user);
                    heroMoves.push(move); 
                }
                  
            }
            for (let i = 0; i < this.playerJson.length; i++) {
                if (this.playerJson[i].used === false) {
                    const hero = new Hero(this.playerJson[i].name, this.playerJson[i].hp, this.playerJson[i].hp, this.playerJson[i].str, heroMoves, this.playerJson[i].sprite, [], this.playerJson[i].mp, this.playerJson[i].mp, this.playerJson[i].int, this.playerJson[i].def, this.playerJson[i].res, this.playerJson[i].spd, this.playerJson[i].luck, this.playerJson[i].race, roleList[chosenRole]);
                    heroList.push(hero);
                }
            }
            heroList.forEach(hero => {
                heroListname.push(hero.getName());
            });
            console.log('============= CHOOSE A HERO =============')
            let chosenHero = readline.keyInSelect(heroListname, '---- different hero have different statistics ----', {cancel : false});
            let hero = heroList[chosenHero];
            hero.applyClass(true);
            hero.status(this);
            this.tower.addHero(hero);
            heroMoves = [];
            heroList = [];
            heroListname = [];
            this.playerJson.forEach((element:any) => {
                if (element.name === hero.getName()) {
                    element.used = true;
                }
            });
        }
    }

    public generateBosses(){
        let enemyMoves: Array<Move> = [];
        let boss = this.raritySort('Boss');
        for (let i = 0; i < this.movesJson.length; i++) {
            if (this.movesJson[i].category === 'Damage' && (this.movesJson[i].user === 'all' || this.movesJson[i].user === 'Monster')) { 
                const move = new Move(this.movesJson[i].dmg, this.movesJson[i].name, this.movesJson[i].category, this.movesJson[i].MpCost, this.movesJson[i].Type, this.movesJson[i].effect, this.movesJson[i].user);               
                enemyMoves.push(move);
            }  
        }
        const enemy = new Enemy(boss.name, Math.floor(boss.hp*this.tower.getDifficulty()), Math.floor(boss.hp*this.tower.getDifficulty()), Math.floor(boss.str*this.tower.getDifficulty()), enemyMoves, boss.sprite, [], boss.mp, boss.int, boss.mp, 
            boss.def, boss.res, boss.spd, Math.floor(boss.luck*this.tower.getDifficulty()), boss.race);
        return([enemy]);


    }


    public gameLoop(){
        while (!this.tower.gameOver() && !this.tower.getEndGame()) {
            while (!this.tower.nexLvl() && !this.tower.gameOver() && !this.tower.getEndGame()) {
                this.tower.turnOrder()
                console.log(`========== floor ${this.tower.getLvl()} ==========`);
                this.displayMonster();
                if (this.tower.getListChar()[0] instanceof Hero) {
                    for (let i = 0; i < this.tower.getListHe().length; i++) {
                        this.displayHealth(this.tower.getListHe()[i]);
                    }
                }
                for (let i = 0; i < this.tower.getListChar().length; i++) {
                    if (!this.tower.getEndGame() && !this.tower.gameOver() && this.tower.getListChar()[i].speedCheck()) {
                        while (this.gestionDeTour(this.tower.getListChar()[i]) === false) { }
                    }
                    if (!this.tower.getEndGame() && !this.tower.getListChar()[i].getPlayedTurn()) {
                        while (this.gestionDeTour(this.tower.getListChar()[i]) === false) {}
                        this.tower.getListChar()[i].setPlayedTurn(true);
                        this.tower.getListChar()[i].cleanEffect();
                        this.tower.getListChar()[i].checkEffect(this.tower.getListChar()[i].getEffect());
                        
                    }
                    if (this.tower.getListChar()[i] instanceof Enemy && this.tower.getListChar()[0] instanceof Enemy) {
                        for (let i = 0; i < this.tower.getListHe().length; i++) {
                            this.displayHealth(this.tower.getListHe()[i]);   
                        }
                    }
                }
                if (!this.tower.getEndGame()) {
                    this.betweenTurn(); 
                }
            }
            if (this.tower.nexLvl() && this.tower.getLvl()+1 % 10 !== 0) {
                this.tower.createFloor(this.generateEnemy())
                this.betweenLvl();
                console.clear();
            } else if (this.tower.nexLvl() && this.tower.getLvl()+1 % 10 === 0) {
                this.tower.createFloor(this.generateBosses());
            } else if (this.tower.nexLvl() && this.tower.getLvl() > 9 && this.tower.getDifficulty() !== 2){
                console.log('VICTORY');
                this.tower.exit();
            }
        }
        this.tower.exit();
        
    }

    public betweenTurn(){
        this.tower.getListChar().forEach(character => {
            character.setPlayedTurn(false);
        });
        this.tower.getListHe().forEach(character => {
            character.setPlayedTurn(false);
        });
        this.tower.getlistEn().forEach(character => {
            character.setPlayedTurn(false);
        });
        const turn = readline.question('==== Next turn ====\n'); 
    }

    public generateLoot(hero: Hero){
        let lootList: Array<Item> = [];
        let randomCons1 = Math.floor(Math.random()*this.lootJson[0].Consumable.length);
        let randomCons2 = Math.floor(Math.random()*this.lootJson[0].Consumable.length);
        let randomEq = Math.floor(Math.random()*this.lootJson[0].Equipement.length);
        const cons1 = new Consumable(this.lootJson[0].Consumable[randomCons1].name, this.lootJson[0].Consumable[randomCons1].effect, this.lootJson[0].Consumable[randomCons1].type);
        const cons2 = new Consumable(this.lootJson[0].Consumable[randomCons2].name, this.lootJson[0].Consumable[randomCons2].effect, this.lootJson[0].Consumable[randomCons2].type);
        lootList.push(cons1, cons2);
        let classList: Array<Class> = this.generateClass();
        if (this.lootJson[0].Equipement[randomEq].roleRequirement === 'all') {
            const eq = new Equipement(this.lootJson[0].Equipement[randomEq].name, this.lootJson[0].Equipement[randomEq].effect,hero.getRole(), this.lootJson[0].Equipement[randomEq].type);
            lootList.push(eq);
        } else {
            classList.forEach((role:Class) => {
                if (role.name === this.lootJson[0].Equipement[randomEq].roleRequirement) {
                    const newRole = new Class(role.name,role.bonus,role.specialMove);
                    const eq = new Equipement(this.lootJson[0].Equipement[randomEq].name, this.lootJson[0].Equipement[randomEq].effect,newRole, this.lootJson[0].Equipement[randomEq].type);
                    lootList.push(eq);
                }
            });
        }
        return(lootList);
    }

    public displayLoot(lootList: Array<Item>){
        let lootListName: Array<string> = [];
        lootList.forEach(element => {
            lootListName.push(element.getName());
        });
        console.log(`you loot `+c.yellow(`${lootListName.join(' | ')}`));
    }

    public addLoot(lootList: Array<Item>, hero:Hero){
        lootList.forEach(item => {
            if (readline.keyInYN(`would you like to take `+ c.yellow(`${item.getName()}`))) {
                if (item instanceof Consumable) {
                    hero.addConsumable(item);
                    console.log(`you add ${item.name} to your inventory`)
                } else if (item instanceof Equipement) {
                    hero.equipItem(item);
                }
            }
        });
    }

    public betweenLvl(){
        let odds = Math.floor(Math.random()*100);
        if (odds <=40) {
            const lootime = readline.question('==== looting time ====\n');
            this.tower.getListHe().forEach(hero => {
                console.log(`======== ${hero.getName()} is looting ========`);
                const lootListe = this.generateLoot(hero);
                this.displayLoot(lootListe);
                this.addLoot(lootListe, hero);
            });
        }
        console.log(`You enter the ${this.tower.getLvl()} floor`)
        this.tower.getListHe().forEach(hero => {
            hero.restoreMp();
            hero.restoreHp();
            console.log(`${hero.getName()} get back to `+ c.green(`${hero.getHp()}`)+`hp and `+ c.cyan(`${hero.getMp()}`)+` Mana`);
        });
        const nextTurn = readline.question('==== Next floor ====\n');
    }

    public displayHealth(char: Character){
        let barre: string = '';
        let magi: string = '';
        for (let i = 0; i < char.getHp(); i++) {
            barre += 'I';
        }
        for (let i = 0; i < char.getHpMax() - char.getHp(); i++) {
            barre += '_';  
        }
        for (let i = 0; i < char.getMp(); i++) {
            magi += '=';
        }
        for (let i = 0; i < char.getMpMax() - char.getMp(); i++) {
            magi += '_';     
        }
        barre += '|';
        magi += '|';
        if (char instanceof Hero) {
            console.log(c.yellow(char.getName()));
        } else if (char instanceof Enemy) {
            console.log(c.magenta(char.getName()));
        }
        if (char.getHp() > Math.floor(char.getHpMax()/2)) {
            console.log(`HP `+c.green(`${barre}`)+` ${char.getHp()}/${char.getHpMax()}`);
        } else if (char.getHp() <= Math.floor(char.getHpMax()/2) && char.getHp() > Math.floor(char.getHpMax()/4)) {
            console.log(`HP `+c.yellow(`${barre}`)+` ${char.getHp()}/${char.getHpMax()}`);
        } else {
            console.log(`HP `+c.red(`${barre}`)+` ${char.getHp()}/${char.getHpMax()}`);
        }
        if (char instanceof Hero) {
            console.log(`MANA : `+c.cyan(magi)+` ${char.getMp()}/${char.getMpMax()}`);
        }
    }

    public displayMonster(){
        let max = 0;
        let maxI = 0;
        this.tower.getlistEn().forEach((monster,i) => {
            if (monster.getHp() > max) {
                max = monster.getHp();
                maxI = i;
            }
        });
        console.log(this.tower.getlistEn()[maxI].getSprite());
        this.tower.getlistEn().forEach(monster => {
            this.displayHealth(monster);
        }); 
    }

    public launcher(tower: Tower, gamelauncher: GameLauncher){
        while (gamelauncher.continue === true) {
            console.log(c.magenta(`      \r\n                                       \/@\r\n                       __        __   \/\\\/\r\n                      \/==\\      \/  \\_\/\\\/   \r\n                    \/======\\    \\\/\\__ \\__\r\n                  \/==\/\\  \/\\==\\    \/\\_|__ \\\r\n               \/==\/    ||    \\=\\ \/ \/ \/ \/_\/\r\n             \/=\/    \/\\ || \/\\   \\=\\\/ \/     \r\n          \/===\/   \/   \\||\/   \\   \\===\\\r\n        \/===\/   \/_________________ \\===\\\r\n     \/====\/   \/ |                \/  \\====\\\r\n   \/====\/   \/   |  _________    \/  \\   \\===\\    THE LEGEND OF \r\n   \/==\/   \/     | \/   \/  \\ \/ \/ \/  __________\\_____      ______       ___\r\n  |===| \/       |\/   \/____\/ \/ \/   \\   _____ |\\   \/      \\   _ \\      \\  \\\r\n   \\==\\             \/\\   \/ \/ \/     | |  \/= \\| | |        | | \\ \\     \/ _ \\\r\n   \\===\\__    \\    \/  \\ \/ \/ \/   \/  | | \/===\/  | |        | |  \\ \\   \/ \/ \\ \\\r\n     \\==\\ \\    \\\\ \/____\/   \/_\\ \/\/  | |_____\/| | |        | |   | | \/ \/___\\ \\\r\n     \\===\\ \\   \\\\\\\\\\\\\\\/   \/\/\/\/\/\/\/ \/|  _____ | | |        | |   | | |  ___  |\r\n       \\==\\\/     \\\\\\\\\/ \/ \/\/\/\/\/\/   \\| |\/==\/ \\| | |        | |   | | | \/   \\ |\r\n       \\==\\     _ \\\\\/ \/ \/\/\/\/\/    _ | |==\/     | |        | |  \/ \/  | |   | |\r\n         \\==\\  \/ \\ \/ \/ \/\/\/      \/|\\| |_____\/| | |_____\/| | |_\/ \/   | |   | |\r\n         \\==\\ \/   \/ \/ \/________\/ |\/_________|\/_________|\/_____\/   \/___\\ \/___\\\r\n           \\==\\  \/               | \/==\/\r\n           \\=\\  \/________________|\/=\/    \r\n             \\==\\     _____     \/==\/ \r\n            \/ \\===\\   \\   \/   \/===\/\r\n           \/ \/ \/\\===\\  \\_\/  \/===\/\r\n          \/ \/ \/   \\====\\ \/====\/\r\n         \/ \/ \/      \\===|===\/\r\n         |\/_\/         \\===\/\r\n                        =  `));
            let exit = readline.question('              press start to continue\n');
            if (exit === 'quit') {
                gamelauncher.continue = false;
            } else {
                const actionList: Array<string> = ['New game', 'Continue'];
                let action = readline.keyInSelect(actionList, '', {cancel : false});
                if (action === 0) {
                    this.difficultyChoice();
                    gamelauncher.gameStart();
                    gamelauncher.gameLoop();
                } else {
                    if (this.save.loadData()) {
                        this.save.getListChar().forEach(char => {
                            if (char.class === 'Enemy') {
                                let enemyMoves: Array<Move> = [];
                                for (let i = 0; i < this.movesJson.length; i++) {
                                    if (this.movesJson[i].category === 'Damage' && (this.movesJson[i].user === 'all' || this.movesJson[i].user === 'Monster')) { 
                                        const move = new Move(this.movesJson[i].dmg, this.movesJson[i].name, this.movesJson[i].category, this.movesJson[i].MpCost, this.movesJson[i].Type, this.movesJson[i].effect, this.movesJson[i].user);               
                                        enemyMoves.push(move);
                                    }  
                                }
                                let sprite: string = '';
                                for (let i = 0; i < this.enemieJson.length; i++) {
                                    if (this.enemieJson[i].name === char.name) {
                                        sprite = this.enemieJson[i].sprite;
                                    }    
                                }
                                const mob = new Enemy(char.name, char.hp, char.hpMax, char.str, enemyMoves,sprite, [], char.mp, char.mpMax, char.int, char.def, char.res, char.spd, char.luck, char.race);
                                mob.setIsProtected(char.isProtected);
                                mob.setPlayedTurn(char.playedTurn);
                                this.tower.addEnemy(mob);
                            } else if (char.class === 'Boss') {
                                let enemyMoves: Array<Move> = [];
                                for (let i = 0; i < this.movesJson.length; i++) {
                                    if (this.movesJson[i].category === 'Damage' && (this.movesJson[i].user === 'all' || this.movesJson[i].user === 'Monster')) { 
                                        const move = new Move(this.movesJson[i].dmg, this.movesJson[i].name, this.movesJson[i].category, this.movesJson[i].MpCost, this.movesJson[i].Type, this.movesJson[i].effect, this.movesJson[i].user);               
                                        enemyMoves.push(move);
                                    }  
                                }
                                let sprite: string = '';
                                for (let i = 0; i < this.bossJson.length; i++) {
                                    if (this.bossJson[i].name === char.name) {
                                        sprite = this.bossJson[i].sprite;
                                    }
                                    
                                }
                                const boss = new Enemy(char.name, char.hp, char.hpMax, char.str, enemyMoves,sprite, [], char.mp, char.mpMax, char.int, char.def, char.res, char.spd, char.luck, char.race);
                                boss.setIsProtected(char.isProtected);
                                boss.setPlayedTurn(char.playedTurn);
                                this.tower.addEnemy(boss);
                            } else if (char.class === 'Hero') {
                                let role = new Class('',[],'');
                                let heroMoves: Array<Move> = [];
                                this.generateClass().forEach(element => {
                                    if (char.role === element.name) {
                                        role = element;
                                    }
                                });
                                for (let i = 0; i < this.movesJson.length; i++) {
                                    if (this.movesJson[i].user === 'all' || this.movesJson[i].user === 'Hero') {
                                        const move = new Move(this.movesJson[i].dmg, this.movesJson[i].name, this.movesJson[i].category, this.movesJson[i].MpCost, this.movesJson[i].Type, this.movesJson[i].effect, this.movesJson[i].user);
                                        heroMoves.push(move); 
                                    } 
                                }
                                let sprite: string = '';
                                for (let i = 0; i < this.playerJson.length; i++) {
                                    if (this.playerJson[i].name === char.name) {
                                        sprite = this.playerJson[i].sprite;
                                    }
                                    
                                }
                                const hero = new Hero(char.name, char.hp, char.hpMax, char.str, heroMoves,sprite, [], char.mp, char.mpMax, char.int, char.def, char.res, char.spd, char.luck, char.race, role);
                                char.Consumable.forEach((item:string) => {
                                    this.lootJson[0].Consumable.forEach((itemJson: any) => {
                                        if (item === itemJson.name) {
                                            const cons = new Consumable(itemJson.name, itemJson.effect, itemJson.type);
                                            hero.addConsumable(cons);
                                        }
                                    });
                                });
                                char.Equipement.forEach((item:string) => {
                                    this.lootJson[0].Equipement.forEach((itemJson: any) => {
                                        if (item === itemJson.name) {
                                            const cons = new Equipement(itemJson.name, itemJson.effect, itemJson.roleRequirement, itemJson.type);
                                            hero.addEquipment(cons);
                                        }
                                    });
                                });
                                hero.setIsProtected(char.isProtected);
                                hero.setPlayedTurn(char.playedTurn);
                                hero.applyClass(false);
                                this.tower.addHero(hero);
                            }
                        });
                        this.tower.setDifficulty(this.save.getDiff());
                        this.gameLoop();
                    }
                }
                if (tower.gameOver()) {
                    console.log('Try again the kingdom needs you');
                } 
            }
        }
    }

    public gestionDeTour(char: Character){
        const actionList: Array<string> = ['ATTACK', 'STATUS', 'ITEMS','RUN','SAVE AND EXIT'];
        if (char instanceof Hero) {
            let action = readline.keyInSelect(actionList, '---- choose an action ----', {cancel : false});
            while (action === 1) {
                let charListName: Array<string> = [];
                this.tower.getListChar().forEach(charname => {
                    charListName.push(charname.getName());
                });
                let charToWatch = readline.keyInSelect(charListName, '---- Analyse ----', {cancel : false});
                this.tower.getListChar()[charToWatch].status(this);
                action = readline.keyInSelect(actionList, '---- choose an action ----', {cancel : false});
            }
            if (action === 0){
                if (!char.chooseMove(this.tower)) {
                    return false; 
                }   
            } else if (action === 3) {
                this.runAway();
                this.betweenLvl(); 
                return true 
            } else if (action === 4) {
                this.save.createSave(this.tower);
                this.tower.setEndGame(true);
                this.continue = false;
                return true 
            } else if (action === 2) {
                if (char.getItems().length > 0) {
                    const ans = char.printInventory();
                    if (ans !== -1) {
                        char.useConsumable(char.getItems()[ans]);
                        return true;
                    }
                    return false;
                } else {
                    console.log('you have no item');
                    return false;
                }
            }
            else {
                return false;
            }
        } else {
            char.chooseMove(this.tower);
        }
        this.tower.deleteChar();
    }

}

