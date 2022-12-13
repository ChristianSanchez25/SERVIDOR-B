import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PasswordService } from './password.service';
import { SearchUserDto } from './dto/search-user.dto';


@Controller('users')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  /*
    Endpoint Get /users
    El metodo find() busca un usuario en la base de datos
    utiliza programacion asincrona
  */
  @Get()
  async find(@Body() searchUserDto: SearchUserDto) {
    return await this.passwordService.find(searchUserDto);
  }

  

}
