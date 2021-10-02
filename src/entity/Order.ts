import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Order {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', nullable: true })
    customer!: string;

    @Column({ type: 'int', nullable: true })
    places!: number;

    @Column({ type: 'text', nullable: true })
    tableNumber!: string | number;

    @Column({ type: 'text', nullable: true })
    waiter!: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ type: 'boolean', default: false })
    takeAway: boolean;

    @Column("simple-json")
    foodstuff: { id: number, quantity: number, notes: string }[];
}
