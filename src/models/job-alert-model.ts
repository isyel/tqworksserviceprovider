import { ServiceRequestModel } from "./service-request-model";
import { ServiceProviderModel } from "./service-provider-model";
import { ActionTakenEnum } from "../enum/ActionTakenEnum";

export class JobAlertModel {
  public serviceRequestId: number;
  public serviceRequest: ServiceRequestModel;
  public serviceProviderId: number;
  public serviceProvider: ServiceProviderModel;
  public actionTaken: ActionTakenEnum;
}