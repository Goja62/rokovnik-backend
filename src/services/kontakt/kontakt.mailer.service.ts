import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { MailConfig } from "config/mail.config";
import { Kontakt } from "src/entities/kontakt";
import { Funkcije } from "src/misc/funkcije";
const funkcija = new Funkcije()


@Injectable()
export class KontaktMailer {
    constructor(private readonly mailerService: MailerService) {}
    
    async sendKontaktEmail(kontakt: Kontakt) {
        this.mailerService.sendMail({
            to: kontakt.email,
            bcc: MailConfig.orderNotificatiomMail,
            subject: 'Novi kontak u rokovniku',
            encoding: 'UTF-8',
            html: funkcija.makeKontakt(kontakt)
        })
    }

    
}