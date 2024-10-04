import { User } from "@nestjs-demo/domain/entity/user";
import { UserResp } from "@nestjs-demo/infra/helper/dto/resp/user.resp";
import { UserPo } from "@nestjs-demo/infra/po/user.po";

export class UserMapper {
  public static fromUserPo(userPo: UserPo): User {
    const user = new User();
    user.id = userPo.id;
    user.name = userPo.name;
    user.email = userPo.email;
    return user;
  }

  public static toUserPo(user: User): UserPo {
    const userPo = new UserPo();
    userPo.id = user.id;
    userPo.name = user.name;
    userPo.email = user.email;
    return userPo;
  }

  public static toUserResp(user: User): UserResp {
    const userResp = new UserResp();
    userResp.id = user.id;
    userResp.name = user.name;
    userResp.email = user.email;
    return userResp;
  }
}