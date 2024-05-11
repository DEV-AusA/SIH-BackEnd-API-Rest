import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeormConfig from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from './modules/email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from './config/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { PropertiesModule } from './modules/properties/properties.module';
import { FilesCloudinaryModule } from './modules/files-cloudinary/files-cloudinary.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeormConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    EmailModule,
    JwtModule.register(jwtConfig), // jwt-email.config.ts
    PassportModule.register({ session: true }),
    PropertiesModule,
    FilesCloudinaryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
