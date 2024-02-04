import {Request} from "express";
import multer, {FileFilterCallback} from "multer";

const fileFilter = (
  request : Request,
  file : Express.Multer.File,
  callback : FileFilterCallback
) : void => { callback(null, file.mimetype === "application/json")};

export const upload = multer({fileFilter : fileFilter});