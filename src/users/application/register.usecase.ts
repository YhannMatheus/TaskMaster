import { UserRepository } from "../infrastructure/user.repositori";
import { 
InvalidEmailFormatError, 
InvalidPasswordFormatError, 
EmailAlreadyUsedError, 
PasswordDoNotMatchError 
} from "@/core/errors/index.error";
import { AuthService, CryptService, ValidatorsService } from "@/core/services/index.service";

interface RegisterResponse {
    firstName: string;
    lastName?: string;
    email: string;
    password:string;
    confirmationPassword: string;
    instituition?: "UFPA" | "UEPA" | "IFPA" | "CESUPA" | "UNAMA" | "FIBRA" | "ESTACIO" | "OUTRO" | "NENHUMA";
}

export const userRegister = async(register: RegisterResponse) => {
    
    if(!ValidatorsService.isValidEmail(register.email)) {
        throw new InvalidEmailFormatError();
    }

    const userAlreadyExists = await UserRepository.findByEmail(register.email);
    if(userAlreadyExists) {
        throw new EmailAlreadyUsedError();
    }

    if(register.password !== register.confirmationPassword) {
        throw new PasswordDoNotMatchError();
    }

    if(!ValidatorsService.isValidPassword(register.password)) {
        throw new InvalidPasswordFormatError();
    }

    const hashedPassword = await CryptService.hashPassword(register.password);
    
    const newUser = await UserRepository.createUser({
        firstName: register.firstName,
        lastName: register.lastName,
        email: register.email.toLocaleLowerCase(),
        password: hashedPassword,
        instituition: register.instituition || "NENHUMA",
        role: 'USER',

    });

    const token = AuthService.generateToken({ userId: newUser.id, email: newUser.email});

    return { user: newUser, token: token };
}