import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity({ name: "netflix_shows" })
export class NetflixShow {
  @PrimaryColumn({ type: "text" })
  show_id: string;

  @Column({ type: "text", nullable: true })
  type: string | null;

  @Column({ type: "text", nullable: true })
  title: string | null;

  @Column({ type: "text", nullable: true })
  director: string | null;

  @Column({ type: "text", nullable: true })
  cast_members: string | null;

  @Column({ type: "text", nullable: true })
  country: string | null;

  @Column({ type: "date", nullable: true })
  date_added: Date | null;

  @Column({ type: "int", nullable: true })
  release_year: number | null;

  @Column({ type: "text", nullable: true })
  rating: string | null;

  @Column({ type: "text", nullable: true })
  duration: string | null;

  @Column({ type: "text", nullable: true })
  listed_in: string | null;

  @Column({ type: "text", nullable: true })
  description: string | null;
}
