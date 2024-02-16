import { Module } from '@nestjs/common';
import { LogoutController } from './logout.controller';
import { LogoutService } from './logout.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [LogoutController],
  providers: [LogoutService],
})
export class LogoutModule {}
