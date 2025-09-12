export class ValidatorsService {
    static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    static isValidPassword(password: string): boolean {
        const minLength = 8;
        // Pelo menos 8 caracteres, uma letra maiúscula, uma minúscula e um número
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        return password.length >= minLength && passwordRegex.test(password);
    }
}