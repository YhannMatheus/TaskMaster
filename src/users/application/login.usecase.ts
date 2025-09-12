import { UserRepository } from "../infrastructure/user.repositori";
import { InvalidCredentialsError} from "@/core/errors/index.error";
import { AuthService, CryptService, ValidatorsService } from "@/core/services/index.service";
import { id } from "zod/v4/locales";

export const userLogin = async(email: string, password: string, remember?: boolean) => {

    const user = await UserRepository.findByEmail(email.toLowerCase());

    if(!user || !CryptService.comparePasswords(password, user.password)) {
        throw new InvalidCredentialsError();
    }

    const token = AuthService.generateToken({ userId: user.id, email: user.email}, remember);

    const userReturn = { 
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        instituition: user.instituition,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };

    return{ token, userReturn};
}