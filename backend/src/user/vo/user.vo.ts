import { UserDetail } from './user-detail.vo';

export class LoginUserVo {
  userDetail: UserDetail;
  accessToken: string;
  refreshToken: string;
}
