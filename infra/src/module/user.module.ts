import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPo } from '@nestjs-demo/infra/po/user.po';
import { UserController } from '@nestjs-demo/infra/controller/user.controller';
import { UserAppSvc } from '@nestjs-demo/app/app.svc/user.app.svc';
import { UserRepo } from '@nestjs-demo/app/port/repo/user.repo';
import { UserRepoImpl } from '@nestjs-demo/infra/adapter/repo.impl/user.repo.impl';
import { UserDomainSvc } from '@nestjs-demo/domain/domain.svc/user.domain.svc';

@Module({
  imports: [TypeOrmModule.forFeature([UserPo])],
  controllers: [UserController],
  providers: [
    {
      provide: UserAppSvc,
      useFactory: (
        userRepo: UserRepo,
        userDomainSvc: UserDomainSvc,
      ) => {
        return new UserAppSvc(userRepo, userDomainSvc);
      },
      inject: [UserRepoImpl, UserDomainSvc],
    },
    UserDomainSvc,
    { provide: 'UserRepository', useClass: UserRepoImpl },
  ],
})
export class UserModule {}
