import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { FoodstuffType } from "./FoodstuffType";

@Entity()
export class Foodstuff {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    shortName!: string;

    @Column({ type: 'text', nullable: true })
    description!: string;

    @Column()
    price: string;

    @ManyToOne(() => FoodstuffType, (type) => type)
    type: FoodstuffType;
}
