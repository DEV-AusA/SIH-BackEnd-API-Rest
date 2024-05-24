import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateChatDto {
  @IsString()
  @IsNotEmpty()
  userIdFrom: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsDate()
  @IsNotEmpty()
  messageDate: Date;

  @IsString()
  @IsNotEmpty()
  roomIdChat: string;

  @IsDate()
  @IsNotEmpty()
  userIdTo: string;
}
