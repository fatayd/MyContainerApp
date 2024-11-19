import { Readline } from "readline/promises";
import { Character } from "./character";
import { Hero } from "./character";
import { Enemy } from "./character";
const c = require('ansi-colors');

export class Tower {

    private name: string;
    private lvl: number = 0;
    private listChar: Array<Character> = [];
    private listEn: Array<Enemy> = [];
    private listHe: Array<Hero> = [];
    private endGame: boolean = false;
    private difficulty: number = 1;

    constructor(name:string){
        this.name = name;
    }

    //  à supprimer
    public exit(){
        this.listChar = [];
        this.listEn = [];
        this.listHe = [];
        this.lvl = 0;
    }

    public getEndGame(){
        return this.endGame;
    }

    public setEndGame(value: boolean){
        this.endGame = value;
    }

    public getLvl(){
        return this.lvl;
    }

    public setLvl(newLvl: number){
        this.lvl = newLvl;
    }

    public getListChar(){
        return this.listChar;
    }

    public getlistEn(){
        return this.listEn;
    }

    public getListHe(){
        return this.listHe;
    }

    public getDifficulty(){
        return this.difficulty;
    }

    public setDifficulty(value: number){
        this.difficulty = value;
    }

    public gameOver(){
        if (this.listHe.length === 0) {
            return true;
        }
        return false;
    }

    public nexLvl(){
        if (this.listEn.length === 0){
            return true;
        }
        return false;
    }

    public deleteChar(){
        for (let i = 0; i < this.getListChar().length; i++) {
            if (this.listChar[i].getHp() <= 0) {
                let id = this.listChar[i].getId();
                if (this.listChar[i] instanceof Hero) {
                    for (let i = 0; i < this.listHe.length; i++) {
                        if (this.listHe[i].getId() === id) {
                            console.log(c.red(`${this.listHe[i].getName()}`)+ ` is `+ c.red(`dead`));
                            this.listHe.splice(i,1);
                        }
                        
                    }
                } else if (this.listChar[i] instanceof Enemy) {
                    for (let i = 0; i < this.listEn.length; i++) {
                        if (this.listEn[i].getId() === id) {
                            console.log(c.red(`${this.listEn[i].getName()}`)+ ` is `+ c.red(`dead`));
                            this.listEn.splice(i,1);
                        }
                        
                    }
                }
                this.listChar.splice(i,1);     
            }
            
        }
    }


    public createFloor(enemyList: Array<Enemy>){
        for (let i = 0; i < enemyList.length; i++) {
            this.listEn.push(enemyList[i]);
            this.listChar.push(enemyList[i]);
            
        }
        this.lvl += 1;
    }

    public addHero(hero: Hero){
        this.listHe.push(hero);
        this.listChar.push(hero);
    }

    public addEnemy(enemy: Enemy){
        this.listEn.push(enemy);
        this.listChar.push(enemy);
    }

    public delEnemy(index: number){
        let id = this.listChar[index].getId();
        this.listEn.forEach((monster, i) => {
            if (monster.getId() === id) {
                this.listEn.splice(i,1);
            }
        });
        this.listChar.splice(index, 1);
    }

    public turnOrder(){
        let res: Array<Character> = [];
        while (this.listChar.length > 0) {
            let max = 0;
            let iMax = 0;
            let speed = 0;
            for (let i = 0; i < this.listChar.length; i++) {
                speed = this.listChar[i].getSpeed();
                if (speed > max) {
                    max = speed;
                    iMax = i;
                }
                
            }
            res.push(this.listChar[iMax]);
            this.listChar.splice(iMax, 1);  
        }
        this.listChar = res;
    }

}