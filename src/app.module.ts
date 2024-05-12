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
import { DataLoaderService } from './helpers/preload-data.helper';
import { User } from './modules/users/entities/user.entity';
import { SeedModule } from './seed/seed.module';

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
    TypeOrmModule.forFeature([User]), // preload data categories
    SeedModule, //sed module
  ],
  controllers: [],
  providers: [DataLoaderService],
})
export class AppModule {}
