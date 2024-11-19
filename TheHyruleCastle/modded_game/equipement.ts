import { Class } from "./class";

export class Item{
    name: string;
    effect: Array<Array<string>>;

    constructor(name: string, effect: Array<Array<string>>){
        this.name = name;
        this.effect = effect;
    }

    getEffect(){
        return this.effect;
    }

    getName(){
        return this.name;
    }
    
}

export class Consumable extends Item{
    type:string;
    expired: boolean = false;

    constructor(name:string, effect: Array<Array<string>>, type: string){
        super(name, effect)
        this.type = type;
    }

    public isExpired(){
        this.expired = true;
    }
}

export class Equipement extends Item{
    roleRequirement: Class;
    type: string;
    equiped: boolean = false;

    constructor(name: string, effect: Array<Array<string>>, rolerequirement: Class, type: string){
        super(name, effect)
        this.roleRequirement = rolerequirement;
        this.type = type;
    }

    equipe(){
        this.equiped = true;
    }

}