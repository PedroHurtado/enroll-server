
import { UUID } from "crypto";
import { Model ,Schema} from "mongoose";
import { IEntity } from "../entitybase";

export const BaseEntitySchema = {
    _id: {
        type: Schema.Types.UUID,
        default: function(this: { id: Schema.Types.UUID }): Schema.Types.UUID {
            return this.id;
        }
    },
    id: {
        type: Schema.Types.UUID,
        required: true,
        unique: true,
    }
};
export const convertUUID = (id:UUID): Schema.Types.UUID => {
    return id as unknown as Schema.Types.UUID;
};

export class Get<T extends IEntity,ID extends Schema.Types.UUID>{
    protected readonly model: Model<T>;

    constructor(model: Model<T>) {
      this.model = model;
    }  
    
    public async get(id: ID): Promise<T> {
        const data = await this.model.findById(id).exec();
        if(data){
            return data
        }  
        throw new Error("Data not found");
    }
}
export class Add<T extends IEntity> {
    protected readonly model: Model<T>;

    constructor(model: Model<T>) {
      this.model = model;
    }  
    public async add(entity: T): Promise<void> {
        await this.model.create(entity);
    }
}
export class Update<T extends IEntity, ID extends Schema.Types.UUID> extends Get<T,ID>{
    constructor(model: Model<T>) {
        super(model);
    }
    public async update(entity: T): Promise<void> {
        await this.model.findByIdAndUpdate(entity.id, entity).exec();
    }
}
export class Delete<T extends IEntity,ID extends Schema.Types.UUID> extends Get<T,ID>{
    constructor(model: Model<T>) {
        super(model);
    }
    public async delete(entity:T): Promise<void> {
        await this.model.findByIdAndDelete(entity.id).exec();
    }
}