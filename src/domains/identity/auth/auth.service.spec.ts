import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '@identity/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findOne: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    const username = 'testuser';
    const password = 'password123';
    const mockUser = {
      id: 'user-123',
      username,
      email: 'test@example.com',
      pwdHash: 'hashed_password',
    };

    it('should return an access token when credentials are valid', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('jwt_token');

      const result = await service.signIn(username, password);

      expect(result).toEqual({ access_token: 'jwt_token' });
      expect(mockUsersService.findOne).toHaveBeenCalledWith(username);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.pwdHash);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
      });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      mockUsersService.findOne.mockResolvedValue(null);

      await expect(service.signIn(username, password)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.signIn(username, password)).rejects.toThrow(
        'Invalid credentials',
      );
      expect(mockUsersService.findOne).toHaveBeenCalledWith(username);
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.signIn(username, password)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.signIn(username, password)).rejects.toThrow(
        'Invalid credentials',
      );
      expect(mockUsersService.findOne).toHaveBeenCalledWith(username);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.pwdHash);
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});
