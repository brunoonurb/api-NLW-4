import nodemailer, { Transporter } from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";

import { host, port, user, pass } from "../config/mail";

class SendMailService {
  private client: Transporter;

  constructor() {
    // let transporter = nodemailer.createTransport({
    //   host: host,
    //   port: port,
    //   secure: false,
    //   auth: {
    //     user,
    //     pass,
    //   }
    // });
    // this.client = transporter;
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

  async execute(to: string, subject: string, variables: object, path) {
    const templateFileContent = fs.readFileSync(path).toString("utf-8");

    const mailTemplatesParse = handlebars.compile(templateFileContent);
    const html = mailTemplatesParse(variables);

    let message = await this.client.sendMail({
      to, // list of receivers
      subject, // Subject line
      text: "Hello world?", // plain text body
      html: html, // html body
      from: '"Test 👻" <test@example.com>', // sender address
    });
    console.log("Message send %s", message.messageId);
    console.log("Message send %s", nodemailer.getTestMessageUrl(message));
  }
}

export default new SendMailService();
