import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
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
            const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

            const userAlreadyExists = await userRepository.findOne({ email })

            if (!userAlreadyExists) {
                return response.status(400).json({
                    error: "User does not exists",
                    message: "Usuário não cadastrado!"
                })
            }

            const survey = await surveyRepository.findOne({ id: survey_id })

            if (!survey) {
                return response.status(400).json({
                    error: "Survey does not exists",
                    message: "Pesquisa não cadastrado!"
                })
            }



            const surveyUser = surveysUsersRepository.create({
                user_id: userAlreadyExists.id,
                survey_id
            })

            await surveysUsersRepository.save(surveyUser)

            await SendMailService.execute(email, survey.title, survey.description);

            return response.status(201).json({
                message: 'Envio com Sucesso',
                surveyUser
            })

        } catch (error) {
            return response.status(500).json({
                message: 'Erro na operação!',
                error
            });
        }
    }
}

export { SendMailControlleer }