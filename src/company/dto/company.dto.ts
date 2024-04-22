import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class createCompanyDto {
  @IsString()
  @IsNotEmpty()
  companyName: string;
}

export class updateCompanyDto {
  @IsString()
  @IsNotEmpty()
  companyName: string;
}
