import { UserRepository } from "../infrastructure/user.repositori";
import { InvalidCredentialsError} from "@/core/errors/index.error";
import { AuthService, CryptService } from "@/core/services/index.service";
// import { SessionRepository } from "@/session/infraestructure/session.repository";

export const userLogin = async(email: string, password: string, remember?: boolean) => {

    const user = await UserRepository.findByEmail(email.toLowerCase());

    if(!user || !CryptService.comparePasswords(password, user.password)) {
        throw new InvalidCredentialsError();
    }

    const token = AuthService.generateToken({ userId: user.id, email: user.email, role: user.role}, remember);
    
    // Temporarily disabled session management to isolate 500 error
    // const existingSession = await SessionRepository.findByEmailAndType(user.email, "login_verification");

    // if(remember){ 
        
    //     if(existingSession && existingSession.id){
            
    //         await SessionRepository.updateSession(existingSession.id, {
    //             token: token,
    //             expiresAt: existingSession.expiresAt ? new Date(existingSession.expiresAt.getTime() + (7*24*60*60*1000)) : new Date(Date.now() + (7*24*60*60*1000))
    //         });
    //     } else {

    //         await SessionRepository.createSession({
    //             email: user.email,
    //             token: token,
    //             type: "login_verification",
    //             expiresAt: new Date(Date.now() + 7*24*60*60*1000)
    //         });
    //     }
    // }

    const userReturn = { 
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        institution: user.institution,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };

    return{ token, userReturn};
}