import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';

interface CreateCompanyParams {
  companyName: string;
}

interface UpdateCompanyParams {
  id: number;
  companyName: string;
}

@Injectable()
export class CompanyService {
  constructor(private readonly prismaService: PrismaService) {}

  async createCompany(userId: number, { companyName }: CreateCompanyParams) {
    const newCompany = await this.prismaService.company.create({
      data: {
        company_name: companyName,
        created_by: userId,
      },
    });

    const response = {
      status: 1,
      message: 'Company successfully created!',
      data: {
        id: newCompany.id,
        companyName: newCompany.company_name,
        createdBy: newCompany.created_by,
        createdAt: newCompany.created_date,
      },
    };

    return response;
  }

  async getCompany(userId: number) {
    const user = await this.prismaService.company.findMany({
      where: { created_by: userId },
    });

    const response = {
      status: 1,
      message: null,
      data: user,
    };

    return response;
  }

  async getCompanyById(userId: number, companyId: number) {
    try {
      const user = await this.prismaService.company.findFirst({
        where: { id: companyId },
      });

      if (user.created_by !== userId) throw new UnauthorizedException();

      const response = {
        status: 1,
        message: null,
        data: user,
      };

      return response;
    } catch (err) {
      throw new NotFoundException('Company not found!');
    }
  }

  async updateCompany({ id, companyName }: UpdateCompanyParams) {
    const company = await this.prismaService.company.findUnique({
      where: { id },
    });
    if (!company) throw new NotFoundException('Company not found!');

    await this.prismaService.company.update({
      where: { id },
      data: { company_name: companyName },
    });

    const response = {
      status: 1,
      message: 'Update company successfully!',
      data: null,
    };

    return response;
  }

  async deleteCompany(id: number) {
    await this.prismaService.company.delete({
      where: { id },
    });

    const response = {
      status: 1,
      message: 'Delete company successfully!',
      data: null,
    };

    return response;
  }
}
