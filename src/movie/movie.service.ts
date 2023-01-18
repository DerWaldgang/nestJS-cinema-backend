import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types'
import { Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { CreateMovieDto } from './dto/create-movie.dto'
import { MovieModel } from './movie.model'

@Injectable()
export class MovieService {
	constructor(
		@InjectModel(MovieModel) private readonly movieModel: ModelType<MovieModel> // private readonly telegramService: TelegramService
	) {}

	async getAllMovies(searchTerm?: string): Promise<DocumentType<MovieModel>[]> {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [
					{
						title: new RegExp(searchTerm, 'i'),
					},
				],
			}
		}

		return this.movieModel
			.find(options)
			.select('-updatedAt -__v')
			.sort({ createdAt: 'desc' })
			.populate('genres actors')
			.exec()
	}

	async getMovieBySlug(slug: string): Promise<DocumentType<MovieModel>> {
		const movie = await this.movieModel
			.findOne({ slug })
			.populate('genres actors')
			.exec()

		if (!movie) throw new NotFoundException('Movie not found!')

		return movie
	}

	async getMovieByActor(
		actorId: Types.ObjectId
	): Promise<DocumentType<MovieModel>[]> {
		const movie = await this.movieModel.find({ actors: actorId }).exec()

		if (!movie) throw new NotFoundException('Movie not found!')

		return movie
	}

	async getMovieByGenres(
		genreIds: Types.ObjectId[]
	): Promise<DocumentType<MovieModel>[]> {
		const movie = await this.movieModel
			.find({ genres: { $in: genreIds } })
			.exec()
		if (!movie) throw new NotFoundException('Movie not found!')

		return movie
	}

	async updateCountOpened(slug: string) {
		const movie = await this.movieModel
			.findOneAndUpdate({ slug }, { $inc: { countOpened: 1 } }, {new: true})
			.exec()

		if (!movie) throw new NotFoundException('Movie not found!')

		return movie
	}


	async updateRating(id: Types.ObjectId, newRating: number) {
		return this.movieModel
			.findByIdAndUpdate(id, { rating: newRating }, { new: true })
			.exec()
	}

	/* Admin area */

	async getMovieById(id: string): Promise<DocumentType<MovieModel>> {
		return this.movieModel.findById(id).exec()
	}

	async createMovie(): Promise<Types.ObjectId> {
		const defaultValue: CreateMovieDto = {
			bigPoster: '',
			actors: [],
			genres: [],
			poster: '',
			title: '',
			videoUrl: '',
			slug: '',
		}
		const movie = await this.movieModel.create(defaultValue)
		return movie._id
	}

	async updateMovie(
		id: string,
		dto: CreateMovieDto
	): Promise<DocumentType<MovieModel> | null> {

		return this.movieModel.findByIdAndUpdate(id, dto, { new: true }).exec()
	}

	async deleteMovie(id: string): Promise<DocumentType<MovieModel> | null> {
		const movie = await this.movieModel.findByIdAndDelete(id).exec()

		if (!movie) throw new NotFoundException('Movie not found!')

		return movie
	}

	async getMostPopularMovies(): Promise<DocumentType<MovieModel>[]> {
		const movie = await this.movieModel
			.find({ countOpened: { $gt: 0 } })
			.sort({ countOpened: -1 })
			.populate('genres')
			.exec()

		if (!movie) throw new NotFoundException('Movie not found!')

		return movie
	}
}
