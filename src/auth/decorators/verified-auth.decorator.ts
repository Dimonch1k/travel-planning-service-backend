import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../guards/jwt.guard'
import { VerifiedUserGuard } from '../guards/verified-user.guard'

export const VerifiedAuth = () => UseGuards(JwtAuthGuard, VerifiedUserGuard)
