import { HttpStatus } from '@nestjs/common';

export class ApplicationException {
  constructor(
    public readonly errorCode: number | string,
    public readonly success: boolean,
    public readonly message: string,
    public readonly statusCode: HttpStatus,
    public readonly resource?: string,
  ) {}
}
