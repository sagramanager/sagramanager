import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

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
}
