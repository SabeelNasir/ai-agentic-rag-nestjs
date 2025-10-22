import { diskStorage, Options } from "multer";
import { AllowedFileMimeTypes } from "./mimetype.config";
import { UnsupportedMediaTypeException } from "@nestjs/common";

export const multerConfig: Options = {
  storage: diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (req, file, cb) => {
    if (!AllowedFileMimeTypes.includes(file.mimetype)) {
      return cb(new UnsupportedMediaTypeException(`File type ${file.mimetype} is not allowed`));
    }
    cb(null, true);
  },
};
