import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";
import * as yup from "yup";
import { AppError } from "../errors/AppErrors";
class UserController {
  async create(request: Request, response: Response) {
    const { name, email } = request.body;

    const shema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
    });

    try {
      await shema.validate(request.body, { abortEarly: false });
    } catch (error) {
      throw new AppError("Email Envalido!", error);
    }

    const usersRepository = getCustomRepository(UsersRepository);

    const userAlreadyExists = await usersRepository.findOne({
      email,
    });
    if (userAlreadyExists) {
      throw new AppError("user already exists!");
    }

    const user = usersRepository.create({
      name,
      email,
    });

    console.log(user);

    await usersRepository.save(user);

    return response.status(201).json({
      message: "Cadastro com Sucesso",
      user,
    });
  }
}

export { UserController };
