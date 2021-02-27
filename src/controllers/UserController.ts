import { Request, Response } from 'express'
import { getRepository } from 'typeorm';
import { User } from '../models/User';

class UserController {

    async create(request: Request, response: Response) {

        const { name, email } = request.body;

        const usersRepository = getRepository(User)

        const user = usersRepository.create({
            name, email
        })

        console.log(user);
        
        await usersRepository.save(user)

        return response.json({
            message: 'Cadastro com Sucesso',
            user
        })
    }
}

export { UserController };