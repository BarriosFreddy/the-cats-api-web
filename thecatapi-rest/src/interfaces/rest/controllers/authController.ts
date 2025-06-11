import { inject, injectable } from "inversify";
import LoginUser from "../../../application/use-cases/auth/loginUser";
import { Request, Response } from "express";
import { generateToken } from "../../../utils/jwt";
import { NODE_ENV } from "../../../config/EnvVariables";


@injectable()
class AuthController {
    private loginUser: LoginUser;
    constructor(@inject("LoginUser") loginUser: LoginUser) {
        this.loginUser = loginUser
        this.login = this.login.bind(this)
        this.logout = this.logout.bind(this)
    }

    async login(req: Request, res: Response) {
        try {
            const user = await this.loginUser.execute(req.body);
            if (!user) {
                return res.status(400).json({
                    message: "Correo y/o contraseña incorrecta"
                });
            }
            
            // Generate JWT token
            const userId = user.id ? user.id.toString() : '';
            const token = generateToken(userId, user.name, user.email);
            
            // Set token in HTTP-only cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
                sameSite: 'strict'
            });
            
            res.status(200).json({
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                },
                token
            });
        } catch (err: any) {
            console.error(err);
            res.status(400).json({ message: err.message });
        }
    }
    
    async logout(_req: Request, res: Response) {
        try {
            res.clearCookie('token');
            res.status(200).json({ message: 'Logout successful' });
        } catch (err: any) {
            console.error(err);
            res.status(500).json({ message: 'Server error during logout' });
        }
    }
}

export default AuthController;