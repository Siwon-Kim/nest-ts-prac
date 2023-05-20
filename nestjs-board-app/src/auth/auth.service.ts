import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { AuthCredentialDto } from './dto/auth-credential.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}

  signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
    return this.usersRepository.signUp(authCredentialDto);
  }

  signIn(authCredentialDto: AuthCredentialDto): Promise<string> {
    return this.usersRepository.signIn(authCredentialDto);
  }
}
