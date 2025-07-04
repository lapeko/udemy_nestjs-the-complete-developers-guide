import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

const currentYear = new Date().getFullYear();

export class CreateReportDto {
  @IsString()
  maker: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(currentYear - 100)
  @Max(currentYear)
  year: number;

  @IsNumber()
  @Min(0)
  @Max(1e6)
  mileage: number;

  @IsLongitude()
  lng: number;

  @IsLatitude()
  lat: number;

  @IsNumber()
  @Min(0)
  @Max(1e6)
  price: number;
}
