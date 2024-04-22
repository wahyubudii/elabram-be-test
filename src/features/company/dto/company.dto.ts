import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class createCompanyDto {
  @IsString()
  @IsNotEmpty()
  companyName: string;
}

export class updateCompanyDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  companyName: string;
}
