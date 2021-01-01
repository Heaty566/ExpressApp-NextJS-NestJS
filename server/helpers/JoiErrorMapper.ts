import { ValidationError } from 'joi';
import * as i18n from 'i18n';

export const JoiErrorMapper = (err: ValidationError) => {
        return err.details.map(item => ({
                path: item.context.key,
                message: `${i18n.__(item.context.label)} ${i18n.__(
                        item.message,
                )}`,
        }));
};
