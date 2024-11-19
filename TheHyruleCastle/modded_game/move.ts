export class Move {
    private dmg: number;
    private name: string;
    private cat: string;
    private mpCost: number;
    private type: string;
    private effect: Array<string>;
    private user:string;
    
    constructor(dmg: number, name: string, cat: string, mpCost: number, type: string, effect: Array<string>, user:string) {
        this.dmg = dmg;
        this.name = name;
        this.cat = cat;
        this.mpCost = mpCost;
        this.type = type;
        this.effect = effect;
        this.user = user;
        
    }

    public getUser(){
        return this.user;
    }

    public getDmg(){
        return this.dmg;
    }

    public getMpCost(){
        return this.mpCost;
    }

    public getName(){
        return this.name;
    }

    public getCat(){
        return this.cat;
    }

    public getType(){
        return this.type;
    }

    public getEffect(){
        return this.effect;
    }

}
