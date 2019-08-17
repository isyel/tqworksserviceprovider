import {UserGroupModel} from "./UserGroupModel";
import {PersonModel} from "./person-model";

export class UserModel extends PersonModel {
  public identityId: string;
  public userGroupId: number;
  public userGroup: UserGroupModel;
  public displayName: string;
  public signupVia: string;
  public profilePhoto: string;
  public emailVerified: boolean;
  public emailVerifiedDate: Date;
  public lastLogin: Date;
  public smsCode: string;
  public facebook: string;
  public instagram: string;
  public linkedin: string;
  public twitter: string;
  public isActive: boolean;
  public isBlocked: boolean;
  public blockedReason: string;
  public ipAddress: string;
  public acceptTerms: boolean;
  public registrationDate: Date;
}
