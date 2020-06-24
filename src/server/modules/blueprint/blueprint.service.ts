import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { JsonService, Json } from '../json';
import { resolve } from 'path';

export type Blueprint = Json

export class BlueprintNotFoundException extends Error {
  name = 'BlueprintNotFoundException';
}

@Injectable()
export class BlueprintService {
  private logger = new Logger('BlueprintService');
  private blueprintsPath: string;

  constructor(
    private jsonService: JsonService,
    private configService: ConfigService
  ) {
    this.blueprintsPath = this.configService.get<string>('blueprintsPath') || '';
  }

  public async getBlueprint(path: string): Promise<Blueprint> {
    const blueprintsPath = resolve(this.blueprintsPath, path);

    this.logger.verbose(`Loading blueprint at "${path}"...`);

    return this.loadData(blueprintsPath);
  }

  private async loadData(path: string): Promise<Json> {
    try {
      return this.jsonService.load(path);
    } catch {
      throw new BlueprintNotFoundException(`Blueprint was not found at ${path}.`);
    }
  }
}
