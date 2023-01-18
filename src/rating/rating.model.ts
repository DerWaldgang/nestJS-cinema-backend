import { prop, Ref } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { Types } from 'mongoose'
import { MovieModel } from 'src/movie/movie.model'
import { UserModel } from 'src/user/user.model'

export interface RatingModel extends Base {}

export class RatingModel extends TimeStamps {
	@prop({ ref: () => MovieModel })
	movieId: Ref<MovieModel>[]

	@prop({ ref: () => UserModel })
	userId: Ref<UserModel>[]

	@prop()
	value: number
}
