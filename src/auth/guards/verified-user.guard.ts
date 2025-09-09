import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable
} from '@nestjs/common'

@Injectable()
export class VerifiedUserGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest()
		const user = request.user

		if (!user) {
			throw new ForbiddenException('Authentication required')
		}

		if (!user.isVerified) {
			throw new ForbiddenException(
				'Email verification required to perform this action. Please check your email and verify your account.'
			)
		}

		return true
	}
}
