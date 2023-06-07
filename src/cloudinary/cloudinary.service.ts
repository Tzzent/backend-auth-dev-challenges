import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  v2,
  UploadApiResponse,
} from 'cloudinary';
import * as fs from 'fs';

@Injectable()
export class CloudinaryService {
  constructor(
    private cloudinary: typeof v2,
    private config: ConfigService,
  ) { }

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<{ url: string, id: string }> {
    const result: UploadApiResponse = await this.cloudinary.uploader.upload(
      file.path, {
      folder: this.config.get<string>('CLOUDINARY_ASSETS_FOLDER')
    });

    this.deleteFilesInFolder('./uploads'); // -> delte all files in uploads folder

    return {
      url: result.secure_url,
      id: result.public_id,
    };
  };

  async deleteImage(
    imageId: string,
  ): Promise<void> {
    await this.cloudinary.uploader.destroy(imageId);
  };

  private deleteFilesInFolder(folderPath: string) {
    const files = fs.readdirSync(folderPath);

    files.forEach((file) => {
      const filePath = `${folderPath}/${file}`;
      fs.unlinkSync(filePath);
    });
  }
}
