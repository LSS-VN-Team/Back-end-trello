import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { IpGuard } from '../guards/ips/ip.guard';

export const IpAuth = (...ips: string[]) => {
  return applyDecorators(SetMetadata('ips', ips), UseGuards(IpGuard));
};
