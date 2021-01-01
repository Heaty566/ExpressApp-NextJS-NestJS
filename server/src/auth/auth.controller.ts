import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Context } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
        constructor(private readonly authService: AuthService) {}

        @Get('/google')
        @UseGuards(AuthGuard('google'))
        googleAuth(@Req() req) {}

        @Get('/google/callback')
        @UseGuards(AuthGuard('google'))
        googleCallBack(@Req() req, @Context('res') res) {
                const token = this.authService.getToken(req.user);
                return res.cookie('token', token).redirect(process.env.CLIENT_URL);
        }

        @Get('/facebook')
        @UseGuards(AuthGuard('facebook'))
        facebookAuth(@Req() req) {}

        @Get('/facebook/callback')
        @UseGuards(AuthGuard('facebook'))
        facebookCallback(@Req() req, @Context('res') res) {
                const token = this.authService.getToken(req.user);
                return res.cookie('token', token).redirect(process.env.CLIENT_URL);
        }

        @Get('/github')
        @UseGuards(AuthGuard('github'))
        githubAuth(@Req() req) {}

        @Get('/github/callback')
        @UseGuards(AuthGuard('github'))
        githubCallback(@Req() req, @Context() res) {
                const token = this.authService.getToken(req.user);
                return res.cookie('token', token).redirect(process.env.CLIENT_URL);
        }
}
