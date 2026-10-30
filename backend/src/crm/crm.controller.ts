import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard, type AuthRequest } from '../auth/jwt-auth.guard.js';
import { CrmService, type QueryInput } from './crm.service.js';
import { FilesService } from './files.service.js';

@Controller('crm')
export class CrmController {
  constructor(
    private readonly crm: CrmService,
    private readonly files: FilesService,
  ) {}
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(@Req() req: AuthRequest) {
    return this.crm.profile(req.user);
  }

  @Post('resources/:resource/query')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  query(
    @Param('resource') resource: string,
    @Body() input: QueryInput,
    @Req() req: AuthRequest,
  ) {
    return this.crm.query(resource, input, req.user);
  }

  @Post('files')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  file(@Body() input: any, @Req() req: AuthRequest) {
    return this.files.operation(input, req.user);
  }

  @Get('files/content/:id')
  @Header('Cache-Control', 'private, no-store')
  async content(
    @Param('id') id: string,
    @Query('expires') expires: string,
    @Query('signature') signature: string,
    @Res() res: Response,
  ) {
    const file = await this.files.readSigned(id, expires, signature);
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${encodeURIComponent(file.path.split('/').pop() || 'download')}`,
    );
    res.send(Buffer.from(file.content));
  }
}
