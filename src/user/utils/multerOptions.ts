import { ForbiddenException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerOptions = {
  storage: diskStorage({
    destination: './uploads',

    filename: (req, file, cb) => {
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');

      cb(null, `${randomName}${extname(file.originalname)}`);
    },
  }),

  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
      return cb(new ForbiddenException('Only image files are allowed!'));
    }

    cb(null, true);
  },

  limits: {
    fileSize: 500 * 1024,
  },
};