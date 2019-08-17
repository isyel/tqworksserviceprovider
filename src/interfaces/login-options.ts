
import {PlatformEnum} from "../enum/PlatformEnum";

export interface LoginOptions {
  username: string;
  password: string;
  rememberMe: boolean;
  channel: PlatformEnum
}
