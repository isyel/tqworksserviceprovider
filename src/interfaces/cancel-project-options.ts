import { PlatformEnum } from "../enum/PlatformEnum";

export interface CancelProjectOptions {
  requestId: number;
  userId: number;
  platform: PlatformEnum;
  cancellationReason: string;
}
