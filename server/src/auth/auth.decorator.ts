import { SetMetadata } from '@nestjs/common';

import { RoleEnum } from '../user/user.enum';

export const Roles = (role: RoleEnum) => SetMetadata('roles', role);
