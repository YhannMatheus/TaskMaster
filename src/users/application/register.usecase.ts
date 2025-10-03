import { UserRepository } from "../infrastructure/user.repositori";
import { 
InvalidEmailFormatError, 
InvalidPasswordFormatError, 
EmailAlreadyUsedError, 
PasswordDoNotMatchError 
} from "@/core/errors/index.error";
import { AuthService, CryptService, ValidatorsService } from "@/core/services/index.service";
// import { SessionRepository } from "@/session/infraestructure/session.repository";

interface RegisterResponse {
    firstName: string;
    lastName?: string;
    email: string;
    password:string;
    confirmationPassword: string;
    institution?: "UFPA" | "UEPA" | "IFPA" | "CESUPA" | "UNAMA" | "FIBRA" | "ESTACIO" | "OUTRO" | "NENHUMA";
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
        institution: register.institution || "NENHUMA",
        role: 'USER',

    });

    const token = AuthService.generateToken({ userId: newUser.id, email: newUser.email, role: newUser.role});
    
    // Temporariamente comentado para depuração
    // await SessionRepository.createSession({
    //     email: newUser.email,
    //     token: token,
    //     type: "email_verification",
    //     expiresAt: new Date(Date.now() + 7*24*60*60*1000)
    // });

    return { user: newUser, token: token };
}