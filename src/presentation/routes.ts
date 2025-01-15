import { Router } from "express";
import { FileUploadRoutes } from "./file-upload/FileRoutes";
import { ImageRoutes } from "./images/ImageRoutes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();
    router.use('/api/images', ImageRoutes.routes);
    router.use('/api/upload', FileUploadRoutes.routes);
    return router;
  }
}
