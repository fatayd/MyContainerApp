import { Move } from "./move";

export class Class {
    name: string;
    bonus: Array<string>;
    specialMove;
    constructor(name: string, bonus: Array<string>, specialMove: any) {
        this.name = name;
        this.bonus = bonus;
        this.specialMove = specialMove;
    }
    
}