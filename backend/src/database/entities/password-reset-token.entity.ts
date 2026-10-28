import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('PasswordResetToken')
export class PasswordResetToken {
  @PrimaryColumn('text') id: string;
  @Index() @Column('text') userId: string;
  @Column('text', { unique: true }) tokenHash: string;
  @Column({ type: 'timestamp', precision: 3 }) expiresAt: Date;
  @Column({ type: 'timestamp', precision: 3, nullable: true })
  usedAt: Date | null;
}
