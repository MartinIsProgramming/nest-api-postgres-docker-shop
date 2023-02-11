import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from '.';

@Entity({ name: 'products' })
export class Product {
  // TABLE COLUMNS
  //
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  title: string;

  @Column('float', { default: 0 })
  price: number;

  @Column('text', { nullable: true })
  description: string;

  @Column('text', { unique: true })
  slug: string;

  @Column('int', { default: 0 })
  stock: number;

  @Column('text', { array: true })
  sizes: string[];

  @Column('text')
  gender: string;

  @Column('text', {
    array: true,
    default: [],
  })
  tags?: string[];

  // RELATIONSHIPS
  //
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  // METHODS BEFORE SAVING AND UPDATING THE TABLE
  //
  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.checkSlugFormat();
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.checkSlugFormat();
  }

  private checkSlugFormat() {
    this.slug = this.slug
      .toLocaleLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
