import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { resolve } from "path";

import { SurveyUser } from "../models/SurveyUser";
import { SurveyRepository } from "../repositories/SurveyRepository";
import { SurveysUsersRepository } from "../repositories/SurveyUserRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";

class SendMailControlleer {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    try {
      const userRepository = getCustomRepository(UsersRepository);
      const surveyRepository = getCustomRepository(SurveyRepository);
      const surveysUsersRepository = getCustomRepository(
        SurveysUsersRepository
      );

      const user = await userRepository.findOne({ email });

      if (!user) {
        return response.status(400).json({
          error: "User does not exists",
          message: "Usuário não cadastrado!",
        });
      }

      const survey = await surveyRepository.findOne({ id: survey_id });

      if (!survey) {
        return response.status(400).json({
          error: "Survey does not exists",
          message: "Pesquisa não cadastrado!",
        });
      }

      const surveyUserExists = await surveysUsersRepository.findOne({
        where: { user_id: user.id, value: null },
        relations: ["user", "survey"],
      });

      const npsPath = resolve(__dirname, "../views/email/npsMail.hbs");
      const variables = {
        name: user.name,
        title: survey.title,
        description: survey.description,
        id: "",
        link: process.env.URL_MAIL,
      };

      if (surveyUserExists) {
        variables.id = surveyUserExists.id;
        await SendMailService.execute(email, survey.title, variables, npsPath);

        return response.status(201).json({
          message: "Envio com Sucesso",
          surveyUserExists,
        });
      }

      const surveyUser = surveysUsersRepository.create({
        user_id: user.id,
        survey_id,
      });

      await surveysUsersRepository.save(surveyUser);

      variables.id = surveyUser.id;
      await SendMailService.execute(email, survey.title, variables, npsPath);

      return response.status(201).json({
        message: "Envio com Sucesso",
        surveyUser,
      });
    } catch (error) {
      return response.status(500).json({
        message: "Erro na operação!",
        error,
      });
    }
  }
}

export { SendMailControlleer };
