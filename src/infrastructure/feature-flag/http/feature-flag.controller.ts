import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { GetParams, GetBody } from '@/infrastructure/shared/http/decorators/parameter.decorators';
import {
  Controller,
  Get,
  Patch,
  Public,
} from '@/infrastructure/shared/http/decorators/route.decorators';
import {
  GetFlagUseCase,
  GetAllFlagsUseCase,
  ToggleFlagUseCase,
  UpdateFlagUseCase,
  FeatureFlagResponse,
  FlagParamDto,
  UpdateFeatureFlagDto,
} from '@/application/feature-flag';

@injectable()
@Controller('/feature-flags')
export class FeatureFlagController {
  constructor(
    @inject(GetFlagUseCase) private getFlagUseCase: GetFlagUseCase,
    @inject(GetAllFlagsUseCase) private getAllFlagsUseCase: GetAllFlagsUseCase,
    @inject(ToggleFlagUseCase) private toggleFlagUseCase: ToggleFlagUseCase,
    @inject(UpdateFlagUseCase) private updateFlagUseCase: UpdateFlagUseCase
  ) {}

  @Get('/')
  @Public()
  async getAllFlags(): Promise<FeatureFlagResponse[]> {
    return this.getAllFlagsUseCase.execute();
  }

  @Get('/:flagName')
  @Public()
  async getFlag(@GetParams(FlagParamDto) params: FlagParamDto): Promise<FeatureFlagResponse> {
    return this.getFlagUseCase.execute(params.flagName);
  }

  @Patch('/:flagName/toggle')
  @Public()
  async toggleFlag(@GetParams(FlagParamDto) params: FlagParamDto): Promise<FeatureFlagResponse> {
    return this.toggleFlagUseCase.execute(params.flagName);
  }

  @Patch('/:flagName')
  @Public()
  async updateFlag(
    @GetParams(FlagParamDto) params: FlagParamDto,
    @GetBody() body: UpdateFeatureFlagDto
  ): Promise<FeatureFlagResponse> {
    return this.updateFlagUseCase.execute(params.flagName, body);
  }
}
