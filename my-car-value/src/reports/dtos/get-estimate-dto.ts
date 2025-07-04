import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

const currentYear = new Date().getFullYear();

export class GetEstimateDto {
  @IsString()
  maker: string;

  @IsString()
  model: string;

  @Transform(({ obj }) => parseInt(obj.year))
  @IsNumber()
  @Min(currentYear - 100)
  @Max(currentYear)
  year: number;

  @Transform(({ obj }) => parseInt(obj.mileage))
  @IsNumber()
  @Min(0)
  @Max(1e6)
  mileage: number;

  @Transform(({ obj }) => parseFloat(obj.lng))
  @IsLongitude()
  lng: number;

  @Transform(({ obj }) => parseFloat(obj.lat))
  @IsLatitude()
  lat: number;
}
