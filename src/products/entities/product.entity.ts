import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/auth/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from '.';

@Entity({ name: 'products' })
export class Product {
  // TABLE COLUMNS
  //
  @ApiProperty({
    example: '1b9c55b2-d639-4787-9fb9-5946ae04bf94',
    description: 'Product ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'T-Shirt Teslo',
    description: 'Product title',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  title: string;

  @ApiProperty({
    example: 0,
    description: 'Product price',
  })
  @Column('float', { default: 0 })
  price: number;

  @ApiProperty({
    example:
      'Commodo dolore esse enim eu reprehenderit culpa consequat deserunt eiusmod fugiat laboris do.',
    description: 'Product Description',
    default: null,
  })
  @Column('text', { nullable: true })
  description: string;

  @ApiProperty({
    example: 't_shirt_teslo',
    description: 'Product SLUG - for SEO routes',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  slug: string;

  @ApiProperty({
    example: 10,
    description: 'Product quantity in stock',
    default: 0,
  })
  @Column('int', { default: 0 })
  stock: number;

  @ApiProperty({
    example: ['M', 'XL', 'S'],
    description: 'Product sizes',
  })
  @Column('text', { array: true })
  sizes: string[];

  @ApiProperty({
    example: 'women',
    description: 'Product gender',
  })
  @Column('text')
  gender: string;

  @ApiProperty({
    example: ['tag_1', 'tag_2'],
    description: 'Product tags',
  })
  @Column('text', {
    array: true,
    default: [],
  })
  tags?: string[];

  // RELATIONSHIPS
  //
  @ApiProperty({
    example: ['image.jpg', 'image2.jpg'],
    description: 'Product images',
  })
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user: User;

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
