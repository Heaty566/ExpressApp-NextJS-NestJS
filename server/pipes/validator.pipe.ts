import {
        ArgumentMetadata,
        BadRequestException,
        Injectable,
        PipeTransform,
} from '@nestjs/common';
import { Args } from '@nestjs/graphql';

import { ObjectSchema } from 'joi';
import { JoiErrorMapper } from '../helpers/JoiErrorMapper';

@Injectable()
export class JoiValidatorPipe implements PipeTransform {
        constructor(private readonly schema: ObjectSchema) {}

        transform(input: any, metaData: ArgumentMetadata) {
                const { error, value } = this.schema.validate(input);
                if (error) throw new BadRequestException(JoiErrorMapper(error));

                return value;
        }
}
