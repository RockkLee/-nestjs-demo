import { Controller, Post, Body, Put, Param, Get, Delete } from '@nestjs/common';
import { UserAppSvc} from '@nestjs-demo/app/app.svc/user.app.svc';
import { UserReq } from '@nestjs-demo/infra/helper/dto/req/user.req';
import { UserResp } from '@nestjs-demo/infra/helper/dto/resp/user.resp';
import { User } from '@nestjs-demo/domain/entity/user';
import { UserMapper } from '@nestjs-demo/infra/helper/util/mapper/user.po.mapper';

@Controller('user')
export class UserController {
  constructor(private readonly userAppService: UserAppSvc) {}

  @Post('create')
  async createUser(
    @Body() body: { name: string; email: string },
  ): Promise<string> {
    const user = await this.userAppService.createUser(body.name, body.email);
    return `User ${user.name} created with ID ${user.id}`;
  }

  @Put(':id')
  async updateUser(
    @Body() userReq: UserReq,
  ): Promise<void> {
    await this.userAppService.updateUser(userReq.id, userReq.email, userReq.email);
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserResp> {
    const user: User = await this.userAppService.getUser(id);
    return UserMapper.toUserResp(user);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<string> {
    await this.userAppService.deleteUser(id);
    return `User ${id} deleted`;
  }
}
