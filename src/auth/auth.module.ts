import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService} from '@nestjs/config';
import { UserModel } from './../user/user.model';
import { TypegooseModule } from 'nestjs-typegoose';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from 'src/config/jwt.config';

@Module({
    controllers: [AuthController],
    imports: [
        TypegooseModule.forFeature([
            {
                typegooseClass: UserModel,
                schemaOptions: {
                    collection: 'User'
                }
            }
        ]),
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: getJWTConfig
        })
    ],
    providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
