import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveyRepository } from '../repositories/SurveyRepository';

class SurveyController {

    async create(request: Request, response: Response) {

        try {
            const { title, description } = request.body;

            const surveyRepository = getCustomRepository(SurveyRepository)

            const survey = surveyRepository.create({
                title,
                description
            });

            await surveyRepository.save(survey);

            return response.status(201).json({
                survey,
                message: 'Casdatrado com sucesso!'
            })
        } catch (error) {
            return response.status(500).json({
                message: 'Erro na operação!'
            })
        }
    }

    async show(request: Request, response: Response) {

        try {

            const surveyRepository = getCustomRepository(SurveyRepository)

            const surveys = await surveyRepository.find();

            return response.status(200).json(surveys);

        } catch (error) {
            return response.status(500).json({
                message: 'Erro na operação!'
            })
        }
    }

}
export { SurveyController };

