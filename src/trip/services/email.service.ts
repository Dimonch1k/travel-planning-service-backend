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
			text: `You have been invited to join the trip "${tripTitle}".\nAccept the invitation here: ${inviteLink}`
		})

		this.logger.log(`Trip invitation sent to ${to}`)
	}
}
