import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { QueryFailedError } from 'typeorm';
import { User } from '../database/entities/user.entity.js';
import { UsersService } from './users.service.js';

describe('UsersService', () => {
  let service: UsersService;
  const repo = {
    findOneBy: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
  beforeEach(async () => {
    vi.resetAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repo },
      ],
    }).compile();
    service = module.get(UsersService);
  });
  it('normalizes fields, hashes passwords and returns no password', async () => {
    repo.findOneBy.mockResolvedValue(null);
    repo.create.mockImplementation((input) => input);
    repo.save.mockImplementation(async (input) => input);
    const user = await service.create({
      name: ' Sam ',
      email: ' SAM@example.com ',
      password: 'strong-password-123',
    });
    const data = repo.create.mock.calls[0]![0];
    expect(data).toMatchObject({ name: 'Sam', email: 'sam@example.com' });
    expect(await bcrypt.compare('strong-password-123', data.password)).toBe(
      true,
    );
    expect(user).not.toHaveProperty('password');
  });
  it('rejects duplicate email', async () => {
    repo.findOneBy.mockResolvedValue({ id: 'existing' });
    await expect(
      service.create({
        name: 'Sam',
        email: 'sam@example.com',
        password: 'strong-password-123',
      }),
    ).rejects.toThrow('already exists');
    expect(repo.save).not.toHaveBeenCalled();
  });
  it('updates only supplied profile fields and excludes passwords', async () => {
    repo.update.mockResolvedValue({ affected: 1 });
    repo.findOneBy.mockResolvedValue({
      id: 'user',
      name: 'Sam',
      password: 'hidden',
    });
    const result = await service.update('user', { name: ' Sam ' });
    expect(repo.update).toHaveBeenCalledWith('user', {
      name: 'Sam',
      updatedAt: expect.any(Date),
    });
    expect(result).not.toHaveProperty('password');
  });
  it('maps update email collisions to a conflict', async () => {
    repo.update.mockRejectedValue(
      new QueryFailedError(
        'UPDATE',
        [],
        Object.assign(new Error('unique'), { code: '23505' }),
      ),
    );
    await expect(
      service.update('user', { email: 'duplicate@example.com' }),
    ).rejects.toThrow('already exists');
  });
  it('rejects updates to missing users', async () => {
    repo.update.mockResolvedValue({ affected: 0 });
    await expect(service.update('missing', { name: 'Sam' })).rejects.toThrow(
      'User not found',
    );
  });
  it('deletes users and reports missing users', async () => {
    repo.delete
      .mockResolvedValueOnce({ affected: 1 })
      .mockResolvedValueOnce({ affected: 0 });
    await expect(service.delete('user')).resolves.toBeUndefined();
    expect(repo.delete).toHaveBeenCalledWith('user');
    await expect(service.delete('missing')).rejects.toThrow('User not found');
  });
});
