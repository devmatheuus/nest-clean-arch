import { CreateProjectDto } from '../dto/create-project.dto';
import { Project } from '../entities/project.entity';
import { Inject, Injectable } from '@nestjs/common';
import { IProjectRepository } from '../project.repository';

@Injectable()
export class CreateProjectUseCase {
  @Inject('IProjectRepository')
  private readonly projectRepository: IProjectRepository;

  async execute(createProjectDto: CreateProjectDto) {
    const project = new Project(createProjectDto);

    await this.projectRepository.create(project);

    return project;
  }
}
