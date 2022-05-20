import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { BadRequestException, Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  limitsOptions = this.configService.get('file.limits');
  createMulterOptions(): MulterModuleOptions {
    return {
      fileFilter: (request, file, callback) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException('지원하지 않는 이미지 형식입니다.'),
            false,
          );
        }
      },
    };
  }
}
