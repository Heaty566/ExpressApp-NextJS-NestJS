import { User } from '../user.entity';

import { GenderEnum } from '../user.enum';

describe('User Class', () => {
        it('Should be defined', () => {
                const user = new User();
                expect(user.username).toBe('');
                expect(user.name).toBe('');
                expect(user.password).toBe('');
                expect(user.birthDay).toBeDefined();
                expect(user.gender).toBe(GenderEnum.MALE);
                expect(user.facebookId).toBe('');
                expect(user.googleId).toBe('');
                expect(user.githubId).toBe('');
                expect(user.password).toBe('');
        });
});
