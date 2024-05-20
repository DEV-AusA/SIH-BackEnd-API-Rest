import { IsNotEmpty, IsString } from 'class-validator';

export class MessageData {
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
