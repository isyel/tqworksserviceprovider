export class BaseModel{
    public id: number;
    public createdDate: Date;
    public updatedDate: Date;
    public softDelete: boolean;
    public deletedTime: Date;
}