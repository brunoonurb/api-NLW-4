import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';

class UserController {

    async create(request: Request, response: Response) {

        const { name, email } = request.body;

        try {
            const usersRepository = getCustomRepository(UsersRepository)

            const userAlreadyExists = await usersRepository.findOne({
                email
            })
            if (userAlreadyExists) {
                return response.status(400).json({
                    error: 'user already exists!',
                    message: 'Usário já existe!'
                })
            }

            const user = usersRepository.create({
                name, email
            })

            console.log(user);

            await usersRepository.save(user)

            return response.status(201).json({
                message: 'Cadastro com Sucesso',
                user
            })
        } catch (error) {
            return response.json({
                message: 'Erro na operação',
                error
            })
        }
    }
}

export { UserController };
