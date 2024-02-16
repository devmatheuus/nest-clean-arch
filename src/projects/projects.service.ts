import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Repository } from 'typeorm';
import { Project, ProjectStatus } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  create(createProjectDto: CreateProjectDto) {
    const project = new Project(createProjectDto);

    if (createProjectDto.started_at) {
      project.status = ProjectStatus.Active;
    }

    return this.projectRepository.save(project);
  }

  findAll() {
    return this.projectRepository.find();
  }

  findOne(id: string) {
    return this.projectRepository.findOneBy({ id });
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.projectRepository.findOneByOrFail({ id });

    updateProjectDto && (project.name = updateProjectDto.name);
    updateProjectDto && (project.description = updateProjectDto.description);

    if (updateProjectDto?.started_at) {
      if (project.status === ProjectStatus.Active) {
        throw new Error('Cannot update started_at for an active project');
      }

      if (project.status === ProjectStatus.Completed) {
        throw new Error('Cannot update started_at for a completed project');
      }

      if (project.status === ProjectStatus.Cancelled) {
        throw new Error('Cannot update started_at for a cancelled project');
      }

      project.status = ProjectStatus.Active;
      project.started_at = updateProjectDto.started_at;
    }

    if (updateProjectDto?.cancelled_at) {
      if (project.status === ProjectStatus.Completed) {
        throw new Error('Cannot update cancelled_at for a completed project');
      }

      if (project.status === ProjectStatus.Cancelled) {
        throw new Error('Cannot update cancelled_at for a cancelled project');
      }

      if (updateProjectDto.cancelled_at < project.started_at) {
        throw new Error('cancelled_at cannot be before started_at');
      }

      project.status = ProjectStatus.Cancelled;
      project.cancelled_at = updateProjectDto.cancelled_at;
    }

    if (updateProjectDto?.finished_at) {
      if (project.status === ProjectStatus.Completed) {
        throw new Error('Cannot update finished_at for a completed project');
      }

      if (project.status === ProjectStatus.Cancelled) {
        throw new Error('Cannot update finished_at for a cancelled project');
      }

      if (updateProjectDto.finished_at < project.started_at) {
        throw new Error('finished_at cannot be before started_at');
      }

      project.status = ProjectStatus.Completed;
      project.finished_at = updateProjectDto.finished_at;
    }

    if (updateProjectDto?.forecasted_at) {
      if (project.status === ProjectStatus.Completed) {
        throw new Error('Cannot update forecasted_at for a completed project');
      }

      if (project.status === ProjectStatus.Cancelled) {
        throw new Error('Cannot update forecasted_at for a cancelled project');
      }

      if (updateProjectDto.forecasted_at < project.started_at) {
        throw new Error('forecasted_at cannot be before started_at');
      }

      project.forecasted_at = updateProjectDto.forecasted_at;
    }

    return this.projectRepository.save(project);
  }

  remove(id: string) {
    return this.projectRepository.delete(id);
  }
}
