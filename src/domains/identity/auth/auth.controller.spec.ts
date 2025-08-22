import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    const loginUserDto: LoginUserDto = {
      username: 'testuser',
      password: 'password123',
    };

    it('should return an access token when credentials are valid', async () => {
      const expectedResult = { access_token: 'jwt_token' };
      mockAuthService.signIn.mockResolvedValue(expectedResult);

      const result = await controller.signIn(loginUserDto);

      expect(result).toEqual(expectedResult);
      expect(authService.signIn).toHaveBeenCalledWith(loginUserDto.username, loginUserDto.password);
    });

    it('should pass through unauthorized exception from service when credentials are invalid', async () => {
      mockAuthService.signIn.mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(controller.signIn(loginUserDto)).rejects.toThrow(UnauthorizedException);
      await expect(controller.signIn(loginUserDto)).rejects.toThrow('Invalid credentials');
      expect(authService.signIn).toHaveBeenCalledWith(loginUserDto.username, loginUserDto.password);
    });

    it('should pass through other errors from service', async () => {
      const error = new Error('Unexpected error');
      mockAuthService.signIn.mockRejectedValue(error);

      await expect(controller.signIn(loginUserDto)).rejects.toThrow('Unexpected error');
      expect(authService.signIn).toHaveBeenCalledWith(loginUserDto.username, loginUserDto.password);
    });
  });
});