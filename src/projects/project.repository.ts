import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

export interface IProjectRepository {
  create(project: Project): Promise<void>;
  update(project: Project): Promise<void>;
  findAll(): Promise<Project[]>;
  findById(id: string): Promise<Project>;
}

@Injectable()
export class ProjectTypeOrmRepository implements IProjectRepository {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(project: Project): Promise<void> {
    await this.projectRepository.save(project);
  }

  async update(project: Project): Promise<void> {
    await this.projectRepository.update(project.id, project);
  }

  async findAll(): Promise<Project[]> {
    return await this.projectRepository.find();
  }

  async findById(id: string): Promise<Project> {
    return await this.projectRepository.findOneByOrFail({ id });
  }
}
