import { RefreshTokenDto } from './dto/refreshToket.dto';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';

@Controller('auth')
export class AuthController {

    constructor(private readonly AuthService: AuthService){}

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('register')
    async register(@Body() dto: AuthDto){
        return this.AuthService.register(dto)
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('login')
    async login(@Body() dto: AuthDto){
        return this.AuthService.login(dto)
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('login/access-token')
    async getNewTokens(@Body() data: RefreshTokenDto){
        return this.AuthService.getNewTokens(data)
    }
}

