import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'
import { CreateGenreDto } from './dto/create-genre.dto'
import { GenreService } from './genre.service'

@Controller('genres')
export class GenreController {
	constructor(private readonly genreService: GenreService) {}

	@Get('by-slug/:slug')
	async getGenreBySlug(@Param('slug') slug: string) {
		return this.genreService.bySlug(slug.toLowerCase())
	}

	@Get('/catalogs')
	async getGenreCatalogs() {
		return this.genreService.getGenreCatalogs()
	}

	@Get()
	async getAllGenres(@Query('searchTerm') searchTerm?: string) {
		return this.genreService.getAllGenres(searchTerm)
	}

	@Get(':id')
	@Auth('admin')
	async getGenreById(@Param('id', IdValidationPipe) id: string) {
		return this.genreService.byId(id)
	}

	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@Auth('admin')
	async createGenre() {
		return this.genreService.createGenre()
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async updateGenre(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: CreateGenreDto
	) {
		return this.genreService.updateGenre(id, dto)
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async deleteGenre(@Param('id', IdValidationPipe) id: string) {
		return this.genreService.deleteGenre(id)
	}
}
