import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateClassroomDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  schoolYear!: string;

  @IsNumber()
  teacherId!: number;
}