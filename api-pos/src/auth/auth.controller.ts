import { UsersService } from '../users/users.service';
import {
  Controller,
  Post,
  Get,
  Query,
  Body,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as jwtDecode from 'jwt-decode';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  @Post('google')
  async googleLogin(@Body() body: { code: string }) {
    return this.handleGoogleAuth(body.code, '');
  }

  @Get('callback')
  async googleCallback(@Query('code') code: string, @Res() res: Response) {
    if (!code) {
      return res.redirect(`${process.env.URL_CALLBACK}?cancelAuth=true`);
    }

    try {
      const result = await this.handleGoogleAuth(code, 'Konsumen');
      // Redirect ke frontend sambil kirim token di query (opsional)
      return res.redirect(
        `${process.env.URL_CALLBACK}/auth/callback?token=${result.token}`,
      );
    } catch (error) {
      console.error('Callback error:', error);
      return res.redirect(`${process.env.URL_CALLBACK}?errorAuth=true`);
      // return res.status(400).send('Gagal login dengan Google');
    }
  }
  @Get('callback-mitra')
  async googleCallbackMitra(@Query('code') code: string, @Res() res: Response) {
    if (!code) {
      return res.redirect(`${process.env.URL_CALLBACK}?cancelAuth=true`);
    }

    try {
      const result = await this.handleGoogleAuth(code, 'Mitra');

      // Redirect ke frontend sambil kirim token di query (opsional)
      return res.redirect(
        `${process.env.URL_CALLBACK}/auth/callback-mitra?token=${result.token}`,
      );
    } catch (error) {
      console.error('Callback error:', error);
      return res.redirect(`${process.env.URL_CALLBACK}?errorAuth=true`);
      // return res.status(400).send('Gagal login dengan Google');
    }
  }

  private async handleGoogleAuth(code: string, role: string) {
    let redirectUri = '';
    if (role == 'Konsumen') {
      redirectUri = `${process.env.API_URL}/auth/callback`;
    } else if (role == 'Mitra') {
      redirectUri = `${process.env.API_URL}/auth/callback-mitra`;
    } else {
      throw new BadRequestException('Role tidak valid.');
    }

    const tokenResponse = await this.httpService.axiosRef.post(
      'https://oauth2.googleapis.com/token',
      new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }).toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );

    const { id_token } = tokenResponse.data;

    if (!id_token) {
      throw new BadRequestException('ID Token tidak ditemukan dari Google.');
    }

    const userInfo: any = jwtDecode.jwtDecode(id_token);

    if (!userInfo.email) {
      throw new BadRequestException('Email tidak ditemukan dalam ID Token.');
    }

    let user = await this.userService.findByEmail(userInfo.email);
    // Jika user belum ada, daftarkan
    if (!user) {
      const rawName = userInfo.name; // Contoh: "John Doe"
      const cleanName = rawName.toLowerCase().replace(/\s+/g, '');
      const randomSuffix = Math.floor(100 + Math.random() * 900); // 3 digit random number
      const username = `${cleanName}${randomSuffix}`;

      const createdUser = await this.userService.create({
        email: userInfo.email,
        name: userInfo.name,
        photo: userInfo.picture,
        sub: userInfo.sub,
        locale: userInfo.locale,
        emailVerified: userInfo.email_verified.toString(),
        givenName: userInfo.given_name,
        familyName: userInfo.family_name,
        googleId: userInfo.sub, // bisa disimpan juga
        username: username,
        role: role,
      });

      // Handle possible error response from create
      if ('message' in createdUser) {
        throw new BadRequestException(
          createdUser.message || 'Gagal membuat user',
        );
      }

      user = createdUser;
    }
    const userId = await this.userService.findByEmail(userInfo.email);

    const appToken = this.jwtService.sign({
      id: userId.id,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      sub: userInfo.sub,
      locale: userInfo.locale,
      email_verified: userInfo.email_verified,
      given_name: userInfo.given_name,
      family_name: userInfo.family_name,
      googleId: userInfo.sub, // bisa disimpan juga
      role: userInfo.role,
    });

    return {
      token: appToken,
      user: {
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
      },
    };
  }

  @Post('payload')
  async payload(@Body('token') token: string) {
    try {
      const verified = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      const user = await this.userService.findByEmail(verified.email);

      return {
        valid: true,
        user: user,
        rawPayload: verified,
      };
    } catch (error) {
      return {
        valid: false,
        error: error.name,
        message: error.message,
      };
    }
  }
}
