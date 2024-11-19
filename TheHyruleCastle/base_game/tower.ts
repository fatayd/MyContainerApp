import { Readline } from "readline/promises";
import { Character } from "./character";
import { Hero } from "./character";
import { Enemy } from "./character";

export class Tower {

    private name: string;
    private lvl: number = 0;
    private listChar: Array<Character> = [];
    private listEn: Array<Enemy> = [];
    private listHe: Array<Hero> = [];

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

    public getLvl(){
        return this.lvl;
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
                            this.listHe.splice(i,1);
                        }
                        
                    }
                } else if (this.listChar[i] instanceof Enemy) {
                    for (let i = 0; i < this.listEn.length; i++) {
                        if (this.listEn[i].getId() === id) {
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

}