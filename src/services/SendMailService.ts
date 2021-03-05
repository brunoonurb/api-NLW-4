import nodemailer, { Transporter } from 'nodemailer';
import { resolve } from 'path'
import handlebars from 'handlebars'
import fs from 'fs'

class SendMailService {
    private client: Transporter;

    constructor() {
        nodemailer.createTestAccount().then(accont => {

            let transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: accont.user, // generated ethereal user
                    pass: accont.pass, // generated ethereal password
                },
            });
            this.client = transporter;
        })
    }

    async execute(to: string, subject: string, body: string) {

        const npsPath = resolve(__dirname, "../views/email/npsMail.hbs")
        const templateFileContent = fs.readFileSync(npsPath).toString("utf-8")

        const mailTemplatesParse = handlebars.compile(templateFileContent)
        const html = mailTemplatesParse({
            name: to,
            title: subject,
            description: body
        })

        let message = await this.client.sendMail({
            to, // list of receivers
            subject, // Subject line
            text: "Hello world?", // plain text body
            html: html, // html body
            from: '"Test 👻" <test@example.com>' // sender address
        });
        console.log('Message send %s', message.messageId);
        console.log('Message send %s', nodemailer.getTestMessageUrl(message));
    }
}

export default new SendMailService();