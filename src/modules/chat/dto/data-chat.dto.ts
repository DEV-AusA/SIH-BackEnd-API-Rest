import { IsNotEmpty, IsString } from 'class-validator';

export class MessageData {
  @IsString()
  @IsNotEmpty()
  userIdFrom: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  userIdTo: string;

  @IsString()
  @IsNotEmpty()
  imageTo: string;
}
