import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Waiter } from "./Waiter";

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

    @ManyToOne(() => Waiter, (waiter) => waiter.orders, { nullable: true })
    waiter!: Waiter;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ type: 'boolean', default: false })
    takeAway: boolean;

    @Column("simple-json")
    foodstuff: { id: number, quantity: number, notes: string }[];
}
