import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddClassroomMemberDto {
  @IsNumber()
  @IsNotEmpty()
  userId!: number;
}