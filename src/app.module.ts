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
import { ExpensesModule } from './modules/expenses/expenses.module';
import { AuthorizationsModule } from './modules/authorizations/authorizations.module';
import { ChatModule } from './modules/chat/chat.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

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
    ExpensesModule, //sed module
    SeedModule, //sed module
    AuthorizationsModule,
    ChatModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // chat
    }),
  ],
  controllers: [],
  providers: [DataLoaderService],
})
export class AppModule {}
