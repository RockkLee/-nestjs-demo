import { UserDomainSvc } from '@nestjs-demo/domain/domain.svc/user.domain.svc';
import { UserRepo } from '@nestjs-demo/app/port/repo/user.repo';
import { User } from '@nestjs-demo/domain/entity/user';

export class UserAppSvc {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly userDomainSvc: UserDomainSvc,
  ) {}

  public async createUser(name: string, email: string): Promise<User> {
    this.userDomainSvc.createUser();

    const user = new User();
    user.name = name;
    user.email = email;

    await this.userRepo.save(user);
    return user;
  }

  public async updateUser(userId: string, newName: string, newEmail: string): Promise<void> {
    this.userDomainSvc.updateUser();
    
    const user = await this.userRepo.findById(userId);
    if (!user)
      throw new Error('User not found');
    user.name = newName;
    user.email = newEmail;
    await this.userRepo.save(user);
  }

  public async deleteUser(userId: string): Promise<void> {
    this.userDomainSvc.deleteUser();
    const user = await this.userRepo.findById(userId);
    if (!user)
      throw new Error('User not found');
    await this.userRepo.deleteById(userId);
  }

  public async getUser(userId: string): Promise<User | null> {
    this.userDomainSvc.getUser();
    const user = await this.userRepo.findById(userId);
    return user;
  }
}
