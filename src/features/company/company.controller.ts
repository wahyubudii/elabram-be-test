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
import { User, UserInfo } from 'src/common/decorators/user.decorator';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('/create')
  async createCompany(@User() user: UserInfo, @Body() body: createCompanyDto) {
    if (!user) throw new UnauthorizedException();

    return this.companyService.createCompany(user.id, body);
  }

  @Get('/list')
  async getCompany(@User() user: UserInfo) {
    if (!user) throw new UnauthorizedException();

    return this.companyService.getCompany(user.id);
  }

  @Get(':id')
  async getCompanyById(@User() user: UserInfo, @Param('id') companyId: number) {
    if (!user) throw new UnauthorizedException();

    return this.companyService.getCompanyById(user.id, companyId);
  }

  @Put('/edit')
  async updateCompany(@User() user: UserInfo, @Body() body: updateCompanyDto) {
    if (!user) throw new UnauthorizedException();

    await this.companyService.getCompanyById(user.id, body.id);

    return this.companyService.updateCompany(body);
  }

  @Delete('/delete')
  async deleteCompany(@User() user: UserInfo, @Body() { id }: { id: number }) {
    if (!user) throw new UnauthorizedException();

    await this.companyService.getCompanyById(user.id, id);

    return this.companyService.deleteCompany(id);
  }
}
