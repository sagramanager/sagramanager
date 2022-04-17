import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Foodstuff } from "./Foodstuff";

@Entity()
export class FoodstuffType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Foodstuff, foodstuff => foodstuff.type)
    foodstuffs: Foodstuff[];
}
