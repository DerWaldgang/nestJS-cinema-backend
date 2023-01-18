import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { MovieModule } from 'src/movie/movie.module';
import { MovieService } from 'src/movie/movie.service';
import { RatingController } from './rating.controller';
import { RatingModel } from './rating.model';
import { RatingService } from './rating.service';

@Module({
  imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: RatingModel,
				schemaOptions: {
					collection: 'Rating',
				},
			},
		]),
    MovieModule
	],
  controllers: [RatingController],
  providers: [RatingService],
  exports: [RatingService]
})
export class RatingModule {}
