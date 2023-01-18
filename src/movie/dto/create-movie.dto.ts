import { IsString, IsNumber, IsArray, IsBoolean, IsObject} from 'class-validator'

export class Parameters {
	@IsNumber()
	year: number

	@IsNumber()
	duration: number

	@IsString()
	country: string
}

export class CreateMovieDto {
	@IsString()
	poster: string

	@IsString()
	bigPoster: string

	@IsString()
	title: string

	@IsString()
	slug: string

	parameters?: Parameters

	@IsString()
	videoUrl: string

	@IsArray()
    @IsString({each: true})
	genres: string[]

    @IsArray()
    @IsString({each: true})
	actors: string[]

	isSendTelegram?: boolean
}
