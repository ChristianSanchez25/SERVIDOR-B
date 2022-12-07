import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PasswordService } from './password.service';
import { SearchUserDto } from './dto/search-user.dto';


@Controller('users')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  @Get()
  async find(@Body() searchUserDto: SearchUserDto) {
    return await this.passwordService.find(searchUserDto);
  }

}
