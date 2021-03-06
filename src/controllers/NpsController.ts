import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveyUserRepository";

class NpsController {
  async execute(request: Request, response: Response) {
    const { survey_id } = request.params;

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveyUser = await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull())
    });

    const detractor = surveyUser.filter(
      (survey) => survey.value >= 0 && survey.value <= 6
    ).length;

    const passivo = surveyUser.filter(
      (survey) => survey.value >= 7 && survey.value <= 8
    ).length;

    const promoters = surveyUser.filter(
      (survey) => survey.value >= 9 && survey.value <= 10
    ).length;

    const totalAnswers = surveyUser.length;

    const calculate = Number((((promoters - detractor) / totalAnswers) * 5).toFixed(2));

    return response.status(200).json({
      detractor,
      passivo,
      promoters,
      totalAnswers,
      nps: calculate
    });
  }
}
export { NpsController };

/*
detratores => 0 - 6
passivos => 7- 8
promotores => 9 - 10
result
(promotores - detratores) / (repondentes) * 100


*/
