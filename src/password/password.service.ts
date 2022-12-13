import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchUserDto } from './dto/search-user.dto';
import { User } from './entities/user.entity';
import * as fs from 'fs';
import * as lockfile from 'proper-lockfile';


@Injectable()
export class PasswordService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository : Repository<User>,
  ) {}
  
  /*
      El metodo find() busca un usuario en la base de datos
      busca el usuario por nombre y password
      si el usuario no existe devuelve un mensaje: INVALIDA
      si el usuario existe devuelve un mensaje: VALIDA
      
  */
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


  /*
     MANEJO DE CONCURRENCIA:
     Lectura de archivo: BD.txt
      Si un usuario quiere crear un usuario y otro usuario quiere buscar un usuario
      el archivo BD.txt se bloquea para que no se pueda leer
      cuando el usuario que quiere crear un usuario termina de crear el usuario
      el archivo se desbloquea y se puede leer
      se usa la libreria lockfile

  */
    async readFile(searchUserDto: SearchUserDto){
      // abrir el archivo modo lectura
      const path = process.env.PATHFILE;
      const options = { wait: 10000, pollPeriod: 100, stale: 5000, retries: 10, retryWait: 100 };
      const file = await fs.readFileSync(path, 'utf8');
      // si el archivo esta bloqueado
      if (lockfile.checkSync(path)) {
        // esperar 10 segundos
        await lockfile.wait(path, options);
        // si el archivo sigue bloqueado
        if (lockfile.checkSync(path)) {
          // lanzar error
          throw new InternalServerErrorException('El archivo esta bloqueado');
        }
      }
      // si el archivo no esta bloqueado
      else {
        // bloquear el archivo
        await lockfile.lock(path, options);
        // buscar el usuario
        await this.find(searchUserDto);
        // desbloquear el archivo
        await lockfile.unlock(path);
      }

    }
  

  
}
