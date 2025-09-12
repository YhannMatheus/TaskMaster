import bcrypt from 'bcrypt';

export class CryptService {
    static hashPassword(password: string): string {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }

    static comparePasswords(password: string, hash: string): boolean {
        return bcrypt.compareSync(password, hash);
    }
}
