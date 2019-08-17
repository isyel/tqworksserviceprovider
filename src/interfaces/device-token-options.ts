import { PlatformEnum } from "../enum/PlatformEnum";

export interface DeviceTokenOptions {
  appType: PlatformEnum;
  userId: number;
  token: string;
  uuid: string;
  deviceData: string;
  isEnabled: boolean
}
