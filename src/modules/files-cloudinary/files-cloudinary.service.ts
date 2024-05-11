import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class FilesCloudinaryService {
  async createFile(file: Express.Multer.File): Promise<UploadApiResponse> {
    return await new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      toStream(file.buffer).pipe(upload);
    });
  }
  async obtainPublicId(secureUrl: string): Promise<string | null> {
    const urlParts = secureUrl.split('/');
    const filename = urlParts.pop();
    const publicId = filename?.split('.')[0]; // El public_id es el nombre del archivo sin extensión
    return publicId || null;
  }

  async deleteFile(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      v2.uploader.destroy(publicId, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}
