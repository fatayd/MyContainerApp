import { Character, Enemy, Hero } from "./character"
import { Consumable, Equipement } from "./equipement";
import { Tower } from "./tower";
var fs = require('fs');
var readline = require('readline-sync');


export class Save{
    private listChar: Array<any>;
    private difficulty: number = 1;
    private path: string = './.save.json'

    constructor(listChar: Array<any>){
        this.listChar = listChar;
    }

    public getDiff(){
        return this.difficulty;
    }

    public getListChar(){
        return this.listChar;
    }

    public createSave(tower: Tower){
        this.listChar = tower.getListChar();
        let equipList: Array<string> = [];
        let itemList: Array<string> = [];
        let perso: string = '';
        let persoList:string ='[';
        this.listChar.forEach((char: Character, i: number) => {
            if (char instanceof Enemy) {
                perso = `{"id": ${char.getId()},"name": "${char.getName()}","hp":  ${char.getHp()}, "hpMax":  ${char.getHpMax()},"mp":  ${char.getMp()}, "mpMax":  ${char.getMpMax()},"str":  ${char.getStr()},"int": ${char.getInt()},"def": ${char.getDef()},"res": ${char.getRes()},"spd":  ${char.getSpeed()},"luck":  ${char.getLuck()},"race": ${char.getRace()}, "class": "Enemy", "playedTurn": ${char.getPlayedTurn()}, "isProtected": ${char.getIsProtected()}}`;
            } else if (char instanceof Enemy && char.getHpMax() > 100) {
                perso = `{"id": ${char.getId()},"name": "${char.getName()}","hp":  ${char.getHp()}, "hpMax":  ${char.getHpMax()},"mp":  ${char.getMp()}, "mpMax":  ${char.getMpMax()},"str":  ${char.getStr()},"int": ${char.getInt()},"def": ${char.getDef()},"res": ${char.getRes()},"spd":  ${char.getSpeed()},"luck":  ${char.getLuck()},"race": ${char.getRace()}, "class": "Boss", "playedTurn": ${char.getPlayedTurn()}, "isProtected": ${char.getIsProtected()}}`;
            } else if (char instanceof Hero) {
                char.getEquipement().forEach((equip: Equipement) => {
                    equipList.push(`"${equip.getName()}"`);
                });
                char.getItems().forEach((item: Consumable) =>{
                    itemList.push(`"${item.getName()}"`);
                });
                perso = `{"id": ${char.getId()},"name": "${char.getName()}","hp":  ${char.getHp()}, "hpMax":  ${char.getHpMax()},"mp":  ${char.getMp()}, "mpMax":  ${char.getMpMax()},"str":  ${char.getStr()},"int": ${char.getInt()},"def": ${char.getDef()},"res": ${char.getRes()},"spd":  ${char.getSpeed()},"luck":  ${char.getLuck()},"race": ${char.getRace()}, "class": "Hero", "role": "${char.getRole().name}", "playedTurn": ${char.getPlayedTurn()}, "isProtected": ${char.getIsProtected()}, "Consumable": [${itemList}] , "Equipement": [${equipList}] }`;
            }
            if (i < this.listChar.length-1) {
                perso += ',';
            }
            persoList += perso;
            equipList = [];
            itemList = [];
        });
        persoList += ']'
        fs.writeFile(this.path,`[{"liste": ${persoList}}, {"difficulty": ${tower.getDifficulty()}}]`, function (err: Error) {
            if (err) throw err;
            console.log('Data saved');
        });
    }

    public loadData(){
        const stat = fs.statSync(this.path);
        if (stat.size !== 0) {
            const data = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
            data[0].liste.forEach((char: any) => {
                this.listChar.push(char);
                console.log(`${char.name} loaded`);
            });
            if (this.listChar.length > 0) {
                console.log('data loaded');
            }
            this.difficulty = data[1].difficulty;
            return true; 
        } else {
            readline.question('------ no saved game ------')
            console.clear();
            return false;
        }
    }
}
