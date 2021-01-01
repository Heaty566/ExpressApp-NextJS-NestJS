import { JoiMongoId, JoiTime } from '../joi.extend';
import { getStringAndNumber } from '../../../test/test-utils/data.helper';

describe('userValidator', () => {
        describe('JoiMongoId', () => {
                const schema = value => {
                        return JoiMongoId.object({ field: JoiMongoId.mongoId() }).validate(value);
                };

                it('should be valid value', () => {
                        const { error, value } = schema({ field: getStringAndNumber(12) });
                        expect(error).toBeUndefined();
                        expect(typeof value.field).toBe('object');
                });

                it('should return an error', () => {
                        const { error } = schema({ field: getStringAndNumber(10) });
                        expect(error).toBeDefined();
                });
        });

        describe('JoiTime', () => {
                const schema = value => {
                        return JoiTime.object({ field: JoiTime.day() }).validate(value);
                };

                it('should be valid value', () => {
                        const { error, value } = schema({ field: { day: 1, month: 1, year: 2020 } });

                        expect(error).toBeUndefined();
                        expect(typeof value.field).toBe('object');
                });

                it('should return an error', () => {
                        const { error } = schema({ field: { day: 200, month: 200, year: -10000 } });
                        expect(error).toBeDefined();
                });
        });
});
