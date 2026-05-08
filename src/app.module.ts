import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ReservationsModule } from './reservations/reservations.module';
import { UsersModule } from './users/users.module';
import { TablesModule } from './tables/tables.module';

@Module({
  imports: [AuthModule, ReservationsModule, UsersModule, TablesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
