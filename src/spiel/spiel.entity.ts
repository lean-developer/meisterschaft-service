import { Mannschaft } from './../mannschaft/mannschaft.entity';
import { Column, ManyToOne } from 'typeorm';
import { Entity } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';

@Entity('spiel')
export class Spiel {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne( type => Mannschaft, mannschaft => mannschaft.heimSpiele)
    heim: Mannschaft;

    @ManyToOne( type => Mannschaft, mannschaft => mannschaft.gastSpiele)
    gast: Mannschaft;

    @Column()
    heimTore?: number;

    @Column() 
    gastTore?: number;  

    get isGespielt(): boolean {
        return (this.heimTore >= 0 && this.gastTore >= 0);
    }

    get isHeimsieg(): boolean {
        return (this.heimTore > this.gastTore);
    }

    get isGastsieg(): boolean {
        return (this.gastTore > this.heimTore);
    }

    get isUnentschieden(): boolean {
        return (this.heimTore === this.gastTore);
    }

    getHeimPunkte(): number {
        if (this.heimTore > this.gastTore) {
            return 3;
        }
        if (this.heimTore === this.gastTore) {
            return 1;
        }
        return 0;
    }

    getGastPunkte(): number {
        if (this.gastTore > this.heimTore) {
            return 3;
        }
        if (this.gastTore === this.heimTore) {
            return 1;
        }
        return 0;
    }
}