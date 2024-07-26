// src/app.module.ts
// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
// import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module';
// import { BusinessModule } from './business/business.module';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { BookingModule } from './booking/booking.module';
// import { AdminController } from './admin/admin.controller';
// import { AdminService } from './admin/admin.service';
// import { AdminModule } from './admin/admin.module';
// import { ReviewModule } from './review/review.module';
// import { PaymentModule } from './payment/payment.module';

// @Module({
//   imports: [
//     ConfigModule.forRoot({ 
//       isGlobal: true, 
//     }),
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: process.env.DATABASE_HOST,
//       port: +process.env.DATABASE_PORT,
//       username: process.env.DATABASE_USERNAME,
//       password: process.env.DATABASE_PASSWORD,
//       database: process.env.DATABASE_NAME,
//       entities: [__dirname + '/**/*.entity{.ts,.js}'],
//       synchronize: true,
//     }),
//     AuthModule,
//     AdminModule,
//     UsersModule,
//     BusinessModule,
//     BookingModule,
//     ReviewModule,
//     PaymentModule
//   ],
//   controllers: [AppController, AdminController],
//   providers: [AppService, AdminService],
// })
// export class AppModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BusinessModule } from './business/business.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingModule } from './booking/booking.module';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { AdminModule } from './admin/admin.module';
import { ReviewModule } from './review/review.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true, 
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        console.log('DATABASE_HOST:', configService.get<string>('DATABASE_HOST'));
        console.log('DATABASE_PORT:', configService.get<number>('DATABASE_PORT'));
        console.log('DATABASE_USERNAME:', configService.get<string>('DATABASE_USERNAME'));
        console.log('DATABASE_PASSWORD:', configService.get<string>('DATABASE_PASSWORD'));
        console.log('DATABASE_NAME:', configService.get<string>('DATABASE_NAME'));
        
        return {
          type: 'postgres',
          host: configService.get<string>('DATABASE_HOST'),
          port: configService.get<number>('DATABASE_PORT'),
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_NAME'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    AdminModule,
    UsersModule,
    BusinessModule,
    BookingModule,
    ReviewModule,
    PaymentModule,
  ],
  controllers: [AppController, AdminController],
  providers: [AppService, AdminService],
})
export class AppModule {}
