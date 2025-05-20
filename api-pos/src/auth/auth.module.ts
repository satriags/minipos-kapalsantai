import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    HttpModule, // <-- tambahkan ini!
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Sesuaikan dengan config kamu
      signOptions: { expiresIn: process.env.EXP_JWT },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
