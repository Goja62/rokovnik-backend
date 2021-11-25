import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Fotografija } from "src/entities/fotografija";
import { ApiResponse } from "src/misc/api.response";
import { Repository } from "typeorm";

@Injectable()
export class SlikaService extends TypeOrmCrudService<Fotografija> { 
    constructor(@InjectRepository(Fotografija) private readonly slika: Repository<Fotografija>) {
        super(slika);
    }

    async findOnePhoto(kontaktId: number): Promise<Fotografija | ApiResponse> {
        return await this.slika.findOne({
            kontaktId: kontaktId
        })
    }

    async addSlika(novaSlika: Fotografija): Promise<Fotografija> {
        return await this.slika.save(novaSlika)
    }

    async brisanjeSlike(imageId: number) {
        return await this.slika.delete(imageId)
    }
}