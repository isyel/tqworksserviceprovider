import { PlatformEnum } from "../enum/PlatformEnum";

export interface ForgotPasswordOptions {
  platform: PlatformEnum;
  email: string;
  phoneNumber: number;
}
