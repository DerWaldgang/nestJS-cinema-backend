import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { IdValidationPipe } from '../pipes/id.validation.pipe'
import { CreateMovieDto } from './dto/create-movie.dto'
import { MovieService } from './movie.service'
import { Auth } from 'src/auth/decorators/Auth.decorator'
import { Types } from 'mongoose'
import { GenreIdsDto } from './dto/genre-ids-dto'

@Controller('movies')
export class MovieController {
	constructor(private readonly movieService: MovieService) {}

	@Get('by-slug/:slug')
	async getMovieBySlug(@Param('slug') slug: string) {
		return this.movieService.getMovieBySlug(slug)
	}

	@Get('by-actor/:actorId')
	async getMovieByActor(@Param('actorId', IdValidationPipe) actorId: Types.ObjectId) {
		return this.movieService.getMovieByActor(actorId)
	}

    @UsePipes(new ValidationPipe())
	@Post('by-genres')
	@HttpCode(200)
	async byGenres(
		@Body()
		{genreIds}: GenreIdsDto
	) {
		return this.movieService.getMovieByGenres(genreIds)
	}

	@Get()
	async getAllMovies(@Query('searchTerm') searchTerm?: string) {
		return this.movieService.getAllMovies(searchTerm)
	}

	@Get('most-popular')
	async getMostPopularMovies() {
		return this.movieService.getMostPopularMovies()
	}

	@Put('update-count-opened')
	@HttpCode(200)
	async updateCountOpened(@Body('slug') slug: string) {
		return this.movieService.updateCountOpened(slug)
	}

	@Get(':id')
	@Auth('admin')
	async getMovieById(@Param('id', IdValidationPipe) id: string) {
		return this.movieService.getMovieById(id)
	}

	@Post()
	@HttpCode(200)
	@Auth('admin')
	async createMovie() {
		return this.movieService.createMovie()
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async updateMovie(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: CreateMovieDto
	) {
		const updateMovie = await this.movieService.updateMovie(id, dto)
		if (!updateMovie) throw new NotFoundException('Movie not found!')
		return updateMovie
	}

	@Delete(':id')
	@Auth('admin')
	async deleteMovie(@Param('id', IdValidationPipe) id: string) {
		const deletedMovie = await this.movieService.deleteMovie(id)
		if (!deletedMovie) throw new NotFoundException('Movie not found!')
	}
}
