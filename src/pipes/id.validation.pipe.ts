import { Types } from 'mongoose';
import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

export class IdValidationPipe implements PipeTransform{
    transform(value: string, meta: ArgumentMetadata){

        if(meta.type !== 'param') {
            return value
        }

        if(!Types.ObjectId.isValid(value)){
            throw new BadRequestException('Invalid parameter')
        }

        return value
    }

}