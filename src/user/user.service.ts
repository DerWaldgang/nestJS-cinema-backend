import { genSalt, hash } from 'bcryptjs'
import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserModel } from './user.model'
import { Types } from 'mongoose'

@Injectable()
export class UserService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>
	) {}

	async byId(_id: string) {
		const user = await this.UserModel.findById(_id)
		if (!user) throw new NotFoundException('User not found!')

		return user
	}

	async updateProfile(_id: string, dto: UpdateUserDto) {
		const user = await this.byId(_id)
		const isUserEmailBusy = await this.UserModel.findOne({ email: dto.email })

		if (isUserEmailBusy && String(_id) !== String(isUserEmailBusy._id)) {
			throw new NotFoundException('This Email is already used by another user')
		}

		if (dto.password) {
			const salt = await genSalt(7)
			user.password = await hash(dto.password, salt)
		}

		user.email = dto.email

		if (dto.isAdmin || dto.isAdmin === false) {
			user.isAdmin = dto.isAdmin
		}

		await user.save()
		return
	}

	async getCountAllUsers() {
		return this.UserModel.find().count().exec()
	}

	async getAllUsers(searchTerm?: string) {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [
					{
						email: new RegExp(searchTerm, 'i'),
					},
				],
			}
		}

		return this.UserModel.find(options)
			.select('-password -updatedAt -__v')
			.sort({ createdAt: 'desc' })
			.exec()
	}

	async deleteUser(id: string) {
		return this.UserModel.findByIdAndDelete(id).exec()
	}

	async toggleFavoriteMovie(movieId: Types.ObjectId, user: UserModel) {
		const { _id, favorites } = user
		await this.UserModel.findByIdAndUpdate(_id, {
			favorites: favorites.includes(movieId)
				? favorites.filter((id) => String(id) !== String(movieId))
				: [...favorites, movieId],
		})
	}

	async getFavoriteMovies(_id: Types.ObjectId) {
		return this.UserModel
			.findById(_id, 'favorites')
			.populate({
				path: 'favorites',
				populate: {
					path: 'genres',
				},
			})
			.exec()
			.then(data => data.favorites)
	}
}
