import crypto from 'crypto';
import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum ProjectStatus {
  Pending = 'pending',
  Active = 'active',
  Cancelled = 'cancelled',
  Completed = 'completed',
}

@Entity()
export class Project {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true, type: 'datetime' })
  started_at: Date | null;

  @Column({ nullable: true, type: 'datetime' })
  cancelled_at: Date | null;

  @Column({ nullable: true, type: 'datetime' })
  finished_at: Date | null;

  @Column({ nullable: true, type: 'datetime' })
  forecasted_at: Date | null;

  @Column({ type: 'simple-enum' })
  status: ProjectStatus = ProjectStatus.Pending;

  constructor(
    partial: {
      name: string;
      started_at?: Date | null;
      cancelled_at?: Date | null;
      forecasted_at?: Date | null;
    },
    id?: string,
  ) {
    Object.assign(this, partial);
    this.id = id ?? crypto.randomUUID();

    if (this.started_at) {
      this.start(this.started_at);
    }
  }

  start(started_at: Date) {
    if (this.status === ProjectStatus.Active) {
      throw new Error('Cannot update started_at for an active project');
    }

    if (this.status === ProjectStatus.Completed) {
      throw new Error('Cannot update started_at for a completed project');
    }

    if (this.status === ProjectStatus.Cancelled) {
      throw new Error('Cannot update started_at for a cancelled project');
    }

    this.started_at = started_at;
    this.status = ProjectStatus.Active;
  }
}
