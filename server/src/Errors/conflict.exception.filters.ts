import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

export function UniqueExceptionFilter(err: any, message: string) {
  if (err?.code === '23505') {
    throw new ConflictException(message);
  } else if (err?.status) {
    switch (err.status) {
      case 400:
        throw new BadRequestException(err?.message ?? 'Bad Request');
      case 401:
        throw new UnauthorizedException(err?.message ?? 'Unauthorized');
      default:
        throw new InternalServerErrorException(
          err?.message ?? 'Internal Service Error',
        );
    }
  } else {
    throw new InternalServerErrorException();
  }
}

export function InvalidInputExceptionFilter(err: any, message: string) {
  if (err?.code === '22P02') {
    throw new ConflictException(message);
  } else if (err?.message) {
    throw new InternalServerErrorException(err?.message);
  }
  throw new InternalServerErrorException();
}

export function UpdateToNothingExceptionFilter(err: any, message: string) {
  if (err?.code === '23503') {
    throw new ConflictException(message);
  } else if (err?.message) {
    throw new InternalServerErrorException(err?.message);
  }
  throw new InternalServerErrorException();
}
