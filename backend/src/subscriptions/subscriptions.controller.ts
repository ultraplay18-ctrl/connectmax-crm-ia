import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { PaymentService } from './payment.service';
import { ChangePlanDto } from './dto/change-plan.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentUser, JwtPayloadUser } from '../common/decorators/current-user.decorator';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard, TenantGuard)
export class SubscriptionsController {
  constructor(
    private readonly subscriptionsService: SubscriptionsService,
    private readonly paymentService: PaymentService,
  ) {}

  @Get('plans')
  async findAllPlans() {
    return this.subscriptionsService.findAllPlans();
  }

  @Get('my-subscription')
  async getMySubscription(@CurrentUser('companyId') companyId: string) {
    return this.subscriptionsService.getMySubscription(companyId);
  }

  @Post('change-plan')
  async changePlan(
    @CurrentUser() user: JwtPayloadUser,
    @Body() dto: ChangePlanDto,
  ) {
    return this.subscriptionsService.changePlan(user.companyId, user.userId, dto);
  }

  @Post('checkout')
  async createCheckout(
    @CurrentUser('companyId') companyId: string,
    @Body('planId') planId: string,
    @Body('provider') providerName?: string,
  ) {
    return this.paymentService.createCheckoutSession(companyId, planId, providerName || 'STRIPE');
  }

  @Post('cancel')
  async cancelSubscription(@CurrentUser('companyId') companyId: string) {
    return this.paymentService.cancelSubscription(companyId);
  }
}
