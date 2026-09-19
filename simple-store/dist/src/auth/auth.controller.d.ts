import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        id: number;
        email: string;
        role: import("@prisma/client").$Enums.Role;
    }>;
    login(loginDto: LoginDto, res: Response): Promise<{
        access_token: string;
    }>;
    logout(res: Response): {
        message: string;
    };
    getMe(req: any): any;
}
