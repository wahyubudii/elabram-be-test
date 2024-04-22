import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { createCompanyDto, updateCompanyDto } from './dto/company.dto';
import { User, UserInfo } from 'src/users/decorators/user.decorator';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  async createCompany(@User() user: UserInfo, @Body() body: createCompanyDto) {
    if (!user) throw new UnauthorizedException();

    return this.companyService.createCompany(user.id, body);
  }

  @Get()
  async getCompany(@User() user: UserInfo) {
    if (!user) throw new UnauthorizedException();

    return this.companyService.getCompany(user.id);
  }

  @Get(':id')
  async getCompanyById(@User() user: UserInfo, @Param('id') companyId: number) {
    if (!user) throw new UnauthorizedException();

    return this.companyService.getCompanyById(user.id, companyId);
  }

  @Put(':id')
  async updateCompany(
    @User() user: UserInfo,
    @Param('id') companyId: number,
    @Body() body: updateCompanyDto,
  ) {
    if (!user) throw new UnauthorizedException();
    await this.companyService.getCompanyById(user.id, companyId);

    return this.companyService.updateCompany(companyId, body);
  }

  @Delete(':id')
  async deleteCompany(@User() user: UserInfo, @Param('id') companyId: number) {
    if (!user) throw new UnauthorizedException();
    await this.companyService.getCompanyById(user.id, companyId);

    return this.companyService.deleteCompany(companyId);
  }
}
