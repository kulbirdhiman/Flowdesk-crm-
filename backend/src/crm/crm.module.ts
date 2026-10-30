import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AccountsController } from './accounts.controller.js';
import { CrmController } from './crm.controller.js';
import { CrmService } from './crm.service.js';
import { FilesService } from './files.service.js';
@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [CrmController, AccountsController],
  providers: [CrmService, FilesService],
})
export class CrmModule {}
