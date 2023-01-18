import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { User } from './decorators/user.decorator'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'
import { Types } from 'mongoose'
import { UserModel } from './user.model'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@Auth()
	async getProfile(@User('_id') _id: string) {
		return this.userService.byId(_id)
	}

	@Get('profile/favorites')
	@Auth()
	async getFavoriteMovies(@User('_id') _id: Types.ObjectId) {
		return this.userService.getFavoriteMovies(_id)
	}

	@Put('profile/favorites')
	@HttpCode(200)
	@Auth()
	async toggleFavoriteMovie(
		@Body('movieId') movieId: Types.ObjectId,
		@User() user: UserModel
	) {
		return this.userService.toggleFavoriteMovie(movieId, user)
	}

	@Get('count')
	@Auth('admin')
	async getCountAllUsers() {
		return this.userService.getCountAllUsers()
	}

	@Get()
	@Auth('admin')
	async getAllUsers(@Query('searchTerm') searchTerm?: string) {
		return this.userService.getAllUsers(searchTerm)
	}

	@Get(':id')
	@Auth('admin')
	async getUserProfile(@Param('id', IdValidationPipe) id: string) {
		return this.userService.byId(id)
	}

	@UsePipes(new ValidationPipe())
	@Put('profile')
	@HttpCode(200)
	@Auth()
	async updateProfile(@User('_id') _id: string, @Body() dto: UpdateUserDto) {
		return this.userService.updateProfile(_id, dto)
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async updateUser(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: UpdateUserDto
	) {
		return this.userService.updateProfile(id, dto)
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async deleteUser(@Param('id', IdValidationPipe) id: string) {
		return this.userService.deleteUser(id)
	}
}
