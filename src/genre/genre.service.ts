import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { MovieService } from 'src/movie/movie.service'
import { CreateGenreDto } from './dto/create-genre.dto'
import { Catalogs } from './genre.interface'
import { GenreModel } from './genre.model'

@Injectable()
export class GenreService {
	constructor(
		@InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>,
		private readonly movieService: MovieService
	) {}

	async bySlug(slug: string) {
		const genre = await this.GenreModel.findOne({ slug }).exec()

		if (!genre) throw new NotFoundException('Genre not found!')

		return genre
	}

	async getAllGenres(searchTerm?: string) {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [
					{
						name: new RegExp(searchTerm, 'i'),
					},
					{
						slug: new RegExp(searchTerm, 'i'),
					},
					{
						description: new RegExp(searchTerm, 'i'),
					},
				],
			}
		}

		return this.GenreModel.find(options)
			.select('-updatedAt -__v')
			.sort({ createdAt: 'desc' })
			.exec()
	}

	async getGenreCatalogs() {

		const genres = await this.getAllGenres()

		const catalogs = await Promise.all(
			genres.map(async (genre) => {

				const moviesByGenre = await this.movieService.getMovieByGenres([
					genre._id,
				])
				
				const result: Catalogs = {
					_id: String(genre._id),
					image: moviesByGenre[0].bigPoster,
					slug: genre.slug,
					title: genre.name,
				}

				return result 
			})
		)
		return catalogs
	}

	/* ADMIN PLACE */
	async byId(_id: string) {
		const genre = await this.GenreModel.findById(_id)
		if (!genre) throw new NotFoundException('Genre not found!')

		return genre
	}

	async updateGenre(_id: string, dto: CreateGenreDto) {
		const updateGenre = await this.GenreModel.findByIdAndUpdate(_id, dto, {
			new: true,
		}).exec()
		if (!updateGenre) throw new NotFoundException('Genre not found!')

		return updateGenre
	}

	async createGenre() {
		const defaultValue: CreateGenreDto = {
			name: '',
			slug: '',
			description: '',
			icon: '',
		}

		const genre = await this.GenreModel.create(defaultValue)
		return genre._id
	}

	async deleteGenre(id: string) {
		const deleteGenre = await this.GenreModel.findByIdAndDelete(id).exec()

		if (!deleteGenre) throw new NotFoundException('Genre not found!')

		return deleteGenre
	}
}
