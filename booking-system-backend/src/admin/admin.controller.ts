// src/admin/admin.controller.ts
import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')

export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('businesses')
  findAllBusinesses() {
    return this.adminService.findAllBusinesses();
  }

  @Get('businesses/:id')
  findBusinessById(@Param('id') id: string) {
    return this.adminService.findBusinessById(+id);
  }

  @Get('users')
  findAllUsers() {
    return this.adminService.findAllUsers();
  }

  @Get('bookings')
  findAllBookings() {
    return this.adminService.findAllBookings();
  }

  @Get('reports')
  generateReport() {
    return this.adminService.generateReport();
  }
}
