export class Move {
    private dmg: number;
    private name: string;
    private cat: string;
    
    constructor(dmg: number, name: string, cat: string) {
        this.dmg = dmg;
        this.name = name;
        this.cat = cat;
    }

    public getDmg(){
        return this.dmg;
    }

    public getName(){
        return this.name;
    }

    public getCat(){
        return this.cat;
    }

}