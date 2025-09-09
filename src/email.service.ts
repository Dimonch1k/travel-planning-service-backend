import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'

import { Variable } from 'src/auth/enums/env.enum'

@Injectable()
export class EmailService {
	private readonly logger = new Logger(EmailService.name)
	private transporter: nodemailer.Transporter

	constructor(private configService: ConfigService) {
		this.transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 587,
			secure: false,
			auth: {
				user: this.configService.get('EMAIL_USER'),
				pass: this.configService.get('EMAIL_PASS')
			}
		})
	}

	async sendTripInvitation(to: string, tripTitle: string, token: string) {
		const frontendUrl =
			this.configService.get(Variable.CLIENT_URL) || 'http://localhost:3000'
		const inviteLink = `${frontendUrl}/invites/${token}`

		await this.transporter.sendMail({
			from: this.configService.get('EMAIL_USER'),
			to,
			subject: `Invitation to Trip "${tripTitle}"`,
			html: `
        <h2>Trip Invitation</h2>
        <p>You have been invited to join the trip "<strong>${tripTitle}</strong>".</p>
        <p><a href="${inviteLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Accept Invitation</a></p>
        <p>Or copy and paste this link: ${inviteLink}</p>
      `
		})

		this.logger.log(`Trip invitation sent to ${to}`)
	}

	async sendEmailVerification(to: string, token: string) {
		const frontendUrl =
			this.configService.get(Variable.CLIENT_URL) || 'http://localhost:3000'
		const verificationLink = `${frontendUrl}/verify-email?token=${token}`

		await this.transporter.sendMail({
			from: this.configService.get('EMAIL_USER'),
			to,
			subject: 'Verify Your Email Address',
			html: `
        <h2>Email Verification</h2>
        <p>Thank you for registering! Please verify your email address to activate your account.</p>
        <p><a href="${verificationLink}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
        <p>Or copy and paste this link: ${verificationLink}</p>
        <p>If you didn't create an account, please ignore this email.</p>
      `
		})

		this.logger.log(`Email verification sent to ${to}`)
	}

	async sendPasswordReset(to: string, token: string) {
		const frontendUrl =
			this.configService.get(Variable.CLIENT_URL) || 'http://localhost:3000'
		const resetLink = `${frontendUrl}/reset-password?token=${token}`

		await this.transporter.sendMail({
			from: this.configService.get('EMAIL_USER'),
			to,
			subject: 'Reset Your Password',
			html: `
        <h2>Password Reset</h2>
        <p>You requested to reset your password. Click the link below to set a new password:</p>
        <p><a href="${resetLink}" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
        <p>Or copy and paste this link: ${resetLink}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
      `
		})

		this.logger.log(`Password reset email sent to ${to}`)
	}
}
