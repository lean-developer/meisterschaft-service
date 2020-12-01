import { Column, ManyToOne } from 'typeorm';
import { Entity } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Mannschaft } from 'src/mannschaft/mannschaft.entity';

@Entity('match')
export class Match {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne( type => Mannschaft, mannschaft => mannschaft.heimMatches)
    heim: Mannschaft;

    @ManyToOne( type => Mannschaft, mannschaft => mannschaft.gastMatches)
    gast: Mannschaft;

    @Column()
    heimTore: number;

    @Column()
    gastTore: number;
}
