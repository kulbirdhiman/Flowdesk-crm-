import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import { visibleTables, type Actor } from './policy.js';
import { emptyTables } from './crm.service.js';
import type { Row } from './query-engine.js';

@Injectable()
export class FilesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}
  private signature(id: string, expires: number) {
    return createHmac('sha256', this.config.getOrThrow<string>('JWT_SECRET'))
      .update(`crm-file:${id}:${expires}`)
      .digest('hex');
  }
  async readSigned(id: string, expires: string, signature: string) {
    const expiry = Number(expires);
    if (
      !Number.isSafeInteger(expiry) ||
      expiry < Date.now() ||
      !/^[a-f0-9]{64}$/.test(signature || '') ||
      !timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(this.signature(id, expiry)),
      )
    )
      throw new ForbiddenException('File link expired or invalid');
    const file = await this.prisma.crmFile.findUnique({ where: { id } });
    if (!file) throw new NotFoundException('File not found');
    return file;
  }
  async operation(input: any, actor: Actor) {
    const { bucket, path, action } = input || {};
    if (
      typeof bucket !== 'string' ||
      !/^[a-zA-Z0-9_-]{1,64}$/.test(bucket) ||
      (action !== 'list' &&
        (typeof path !== 'string' || path.length > 512 || path.includes('..')))
    )
      throw new BadRequestException('Invalid bucket or path');
    if (action === 'upload') {
      if (
        typeof input.content !== 'string' ||
        input.content.length > 14 * 1024 * 1024 ||
        !/^[A-Za-z0-9+/]*={0,2}$/.test(input.content)
      )
        throw new BadRequestException('Files must be at most 10 MB');
      const content = Buffer.from(input.content, 'base64');
      if (content.length > 10 * 1024 * 1024)
        throw new BadRequestException('Files must be at most 10 MB');
      const mimeType =
        typeof input.mimeType === 'string' &&
        /^[\w.+-]+\/[\w.+-]+$/.test(input.mimeType)
          ? input.mimeType
          : 'application/octet-stream';
      // Create only; callers must choose a new path to replace a file.
      try {
        await this.prisma.crmFile.create({
          data: { ownerId: actor.id, bucket, path, mimeType, content },
        });
      } catch (e: any) {
        if (e.code === 'P2002')
          throw new BadRequestException('File path already exists');
        throw e;
      }
      return { path, fullPath: `${bucket}/${path}` };
    }
    if (action === 'list')
      return this.prisma.crmFile
        .findMany({
          where: {
            bucket,
            ...(actor.role === 'ADMIN' ? {} : { ownerId: actor.id }),
          },
          select: { path: true, createdAt: true },
        })
        .then((rows) =>
          rows.map((r) => ({ name: r.path, created_at: r.createdAt })),
        );
    const file = await this.prisma.crmFile.findUnique({
      where: { bucket_path: { bucket, path } },
    });
    if (!file) throw new NotFoundException('File not found');
    if (actor.role !== 'ADMIN' && file.ownerId !== actor.id) {
      if (action === 'remove')
        throw new ForbiddenException('Only the uploader can delete this file');
      const tables = emptyTables();
      for (const r of await this.prisma.crmRecord.findMany())
        if (tables[r.resource]) tables[r.resource].push(r.data as Row);
      const visible = visibleTables(tables, actor);
      const reference = `crm-file://${bucket}/${path}`;
      const sharedTask =
        bucket === 'documents' &&
        visible.tasks.some(
          (r) =>
            Array.isArray(r.attachments) &&
            r.attachments.some((a: any) => a.path === path),
        );
      const permitted =
        sharedTask ||
        visible.documents.some(
          (r) =>
            r.file_url === reference &&
            visible.document_assignments.some(
              (a) => a.document_id === r.id && a.can_download !== false,
            ),
        );
      if (!permitted)
        throw new ForbiddenException('This file is not assigned to you');
    }
    if (action === 'remove') {
      await this.prisma.crmFile.delete({ where: { id: file.id } });
      return { path };
    }
    if (action === 'download')
      return {
        content: Buffer.from(file.content).toString('base64'),
        mimeType: file.mimeType,
      };
    if (action === 'sign') {
      const expires = Date.now() + 5 * 60 * 1000;
      return {
        signedUrl: `/crm/files/content/${file.id}?expires=${expires}&signature=${this.signature(file.id, expires)}`,
      };
    }
    throw new BadRequestException('Unknown file action');
  }
}
