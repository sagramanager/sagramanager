import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class FoodstuffType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}
