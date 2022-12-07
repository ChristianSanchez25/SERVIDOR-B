import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchUserDto } from './dto/search-user.dto';
import { User } from './entities/user.entity';


@Injectable()
export class PasswordService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository : Repository<User>,
  ) {}
  
  async find(searchUserDto: SearchUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        nombre: searchUserDto.nombre.toLowerCase(),
        password: searchUserDto.password,
      }
    })

    if (!user) {
      return {
        message: 'INVALIDA'
      };
    }
    return {
      message: 'VALIDA'
    };
  }
  

  
}
