import { Inject, Injectable } from '@nestjs/common';
import { StartProjectDto } from '../dto/start-project.dto';
import { IProjectRepository } from '../project.repository';

@Injectable()
export class StartProjectUseCase {
  constructor(
    @Inject('IProjectRepository')
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(id: string, input: StartProjectDto) {
    const project = await this.projectRepository.findById(id);

    project.start(input.started_at);

    await this.projectRepository.update(project);

    return project;
  }
}
