// src/business/business.controller.ts
import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Controller('businesses')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  async create(@Body() createBusinessDto: CreateBusinessDto) {
    return await this.businessService.create(createBusinessDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateBusinessDto: UpdateBusinessDto) {
    return this.businessService.update(Number(id), updateBusinessDto); 
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.businessService.findById(Number(id)); 
  }

  @Get()
  async findAll() {
    return this.businessService.findAll();
  }

  @Get('owner/:ownerId')
  async findByOwnerId(@Param('ownerId') ownerId: string) {
    return this.businessService.findByOwnerId(+ownerId);
  }

  @Get(':id/services')
  async getServices(@Param('id') businessId: number) {
    return this.businessService.getServicesForBusiness(businessId);
  }
}