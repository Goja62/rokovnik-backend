import { Get, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AddAdminisratorDto } from "src/dtos/administrator/add.administrator.dto";
import { Administrator } from "src/entities/administrator";
import { Repository } from "typeorm";
import * as crypto from "crypto"
import { EditAdminisratorDto } from "src/dtos/administrator/edit.administrator.dto";

@Injectable()
export class AdministratorService {
    constructor(@InjectRepository(Administrator) private readonly administrator: Repository<Administrator>) {}

    async sviAdministratori(): Promise<Administrator[]> {
        return await this.administrator.find()
    }

    jedanAdministrator(id: number): Promise<Administrator> {
        return this.administrator.findOne(id)
    }

    async getAdministratorByUsername(username: string): Promise<Administrator | null> {
       const administrator: Administrator = await this.administrator.findOne({
           username: username,
       })

       if (!administrator) {
           return null
       }

       return administrator
    }

    async addAdministrator(data: AddAdminisratorDto): Promise<Administrator> {
        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password)
        const passwordHashString = passwordHash.digest('hex').toUpperCase()

        const newAdmin = new Administrator() 
        newAdmin.username = data.username;
        newAdmin.passwordHash = passwordHashString

        return await this.administrator.save(newAdmin)

    }

    async editAdministrator(administratorId: number, data: EditAdminisratorDto): Promise<Administrator> {
        let administrator = await this.administrator.findOne(administratorId)

        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password)
        const passwordHashString = passwordHash.digest('hex').toUpperCase()

        administrator.passwordHash = passwordHashString

        return await this.administrator.save(administrator)
        // Mo??e i ovako => return administrator
    }
}

