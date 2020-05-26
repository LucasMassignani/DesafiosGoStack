import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

interface FindOrCreateDTO {
  title: string;
}

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async findOrCreate({ title }: FindOrCreateDTO): Promise<Category> {
    const categoryExists = await this.findOne({
      where: {
        title,
      },
    });

    if (categoryExists) return categoryExists;

    const newCategory = await this.create({
      title,
    });

    await this.save(newCategory);

    return newCategory;
  }
}

export default CategoriesRepository;
