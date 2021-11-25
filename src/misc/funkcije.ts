
import { StorageConfig } from "config/storage.config";
import * as sharp from "sharp";

export class Funkcije {
    public istekToena(milisekunde: number) {
        return new Date().getTime() / 1000 + milisekunde
    }
    
    public async createResizedImage(photo, resizeSetings) {
        const orignalFilePath = photo.path;
        const fileName = photo.filename;

        const destinationFilePath = StorageConfig.slika.destinacija  + resizeSetings.directory + fileName

        sharp(orignalFilePath)
            .resize({
                fit: 'cover',
                width: resizeSetings.width,
                height: resizeSetings.height
            })
            .toFile(destinationFilePath)
    }
}