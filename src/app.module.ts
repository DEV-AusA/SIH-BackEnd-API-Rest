import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PropertyModule } from './modules/property/property.module';

@Module({
  imports: [AuthModule, PropertyModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
