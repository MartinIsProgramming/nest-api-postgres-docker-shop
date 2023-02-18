import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateUserDto) {
    try {
      const { password, ...rest } = createAuthDto;

      // * 1) WE NEED TO ENCRYPT THE PASSWORD
      const newUser = this.userRepository.create({
        ...rest,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(newUser);

      // * 2) WE NEED TO RETURN THE JWT FOR FUTURE REQUEST AUTHENTICATION
      return {
        ...newUser,
        token: this.getJwtPayload({ id: newUser.id }),
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });

    // * 1) CHECK IF THERE IS ANY USER WITH THIS PARTICULAR EMAIL
    if (!user) {
      throw new UnauthorizedException('Wrong credentials');
    }

    // * 2) CHECK THAT THE PASSWORD AND EMAIL MATCHES WITH THE USER
    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Wrong credentials');
    }

    // * 3) WE NEED TO RETURN THE JWT FOR FUTURE REQUEST AUTHENTICATION

    return {
      ...user,
      token: this.getJwtPayload({ id: user.id }),
    };
  }

  async checkStatus(user: User) {
    return {
      ...user,
      token: this.getJwtPayload({ id: user.id }),
    };
  }

  private getJwtPayload(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);

    return token;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    throw new InternalServerErrorException('Please check server logs');
  }
}
