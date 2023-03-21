import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Role } from '../../../common/src/enums/role.enum';
import { RolesGuard } from '../guards/roles/roles.guard';
import { JwtAuthGuard } from '../guards/jwt-auth/jwt-auth.guard';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

export const Auth = (...roles: Role[]) => {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
  );
};
