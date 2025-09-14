import { UserNotFoundError } from "@/core/errors/user-not-found-error";
import { UserRepository } from "../infrastructure/user.repositori";

export const userProfile = async (id: string) => {
    
    const user = await UserRepository.profileuser(id);
    
    if (!user) throw new UserNotFoundError();

    return user;
}