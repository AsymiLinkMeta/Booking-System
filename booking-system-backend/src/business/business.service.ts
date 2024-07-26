// src/business/business.service.ts
import { Injectable, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from './business.entity';
import { Service } from '../service/service.entity';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { UsersService } from '../users/users.service';
import { BusinessResponseDto } from './dto/business-response.dto';
import { plainToInstance } from 'class-transformer';
import { BusinessHours } from '../business/business-hours.type';

@Injectable()
export class BusinessService {
  private readonly logger = new Logger(BusinessService.name);

  constructor(
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    private usersService: UsersService,
  ) {}

  async create(createBusinessDto: CreateBusinessDto): Promise<BusinessResponseDto> {
    this.logger.log(`Creating business with DTO: ${JSON.stringify(createBusinessDto)}`);
  
    const owner = await this.usersService.findById(createBusinessDto.ownerId);
    if (!owner) {
      throw new NotFoundException(`User with ID ${createBusinessDto.ownerId} not found`);
    }
  
    const defaultBusinessHours: BusinessHours = {
      Monday: { open: '', close: '' },
      Tuesday: { open: '', close: '' },
      Wednesday: { open: '', close: '' },
      Thursday: { open: '', close: '' },
      Friday: { open: '', close: '' },
      Saturday: { open: '', close: '' },
      Sunday: { open: '', close: '' },
    };
  
    const business = this.businessRepository.create({
      ...createBusinessDto,
      businessHours: createBusinessDto.businessHours || defaultBusinessHours,
      owner,
    });
  
    business.servicesOffered = createBusinessDto.servicesOffered.map(serviceDto => {
      const service = this.serviceRepository.create(serviceDto);
      service.business = business;
      return service;
    });
  
    const savedBusiness = await this.businessRepository.save(business);
    return plainToInstance(BusinessResponseDto, savedBusiness);
  }

  async update(id: number, updateBusinessDto: UpdateBusinessDto): Promise<BusinessResponseDto> {
    const business = await this.businessRepository.findOne({
      where: { id },
      relations: ['servicesOffered', 'owner'],
    });

    if (!business) {
      throw new NotFoundException(`Business with ID ${id} not found`);
    }

    Object.assign(business, updateBusinessDto);

    if (updateBusinessDto.servicesOffered) {
      await this.serviceRepository.update(
        { business: { id } },
        { isDeleted: true }
      );

      business.servicesOffered = updateBusinessDto.servicesOffered.map(serviceDto => {
        const service = this.serviceRepository.create(serviceDto);
        service.isDeleted = false; 
        service.business = business;
        return service;
      });
    }

    const updatedBusiness = await this.businessRepository.save(business);
    return plainToInstance(BusinessResponseDto, updatedBusiness);
  }

  async findById(id: number): Promise<BusinessResponseDto> {
    const business = await this.businessRepository.findOne({
      where: { id },
      relations: ['servicesOffered', 'owner'], 
    });

    if (!business) {
      throw new NotFoundException(`Business with ID ${id} not found`);
    }

    const businessDto = plainToInstance(BusinessResponseDto, business);
    businessDto.ownerId = business.owner ? business.owner.id : null;
    return businessDto;
  }

  async findAll(): Promise<BusinessResponseDto[]> {
    const businesses = await this.businessRepository.find({
      relations: ['servicesOffered', 'owner'], 
    });

    return businesses.map(business => {
      const businessDto = plainToInstance(BusinessResponseDto, business);
      businessDto.ownerId = business.owner ? business.owner.id : null;
      return businessDto;
    });
  }

  async findByOwnerId(ownerId: number): Promise<BusinessResponseDto[]> {
    const businesses = await this.businessRepository.find({
      where: { owner: { id: ownerId } },
      relations: ['servicesOffered', 'owner'],
    });

    return businesses.map(business => {
      const businessDto = plainToInstance(BusinessResponseDto, business);
      businessDto.ownerId = business.owner ? business.owner.id : null; 
      return businessDto;
    });
  }

  async getServicesForBusiness(businessId: number): Promise<Service[]> {
    const business = await this.businessRepository.findOneBy({ id: businessId });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return this.serviceRepository.find({ where: { business: { id: businessId } } });
  }
}

