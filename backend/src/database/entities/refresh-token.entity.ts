import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('RefreshToken')
export class RefreshToken {
  @PrimaryColumn('text') id: string;
  @Index() @Column('text') userId: string;
  @Column('text', { unique: true }) tokenHash: string;
  @Column({ type: 'timestamp', precision: 3 }) expiresAt: Date;
  @Column({ type: 'timestamp', precision: 3, nullable: true })
  revokedAt: Date | null;
  @Column({ type: 'timestamp', precision: 3, nullable: true })
  lastUsedAt: Date | null;
}
