import { UUID } from "crypto";
import { Model, Schema } from "mongoose";
import { IEntity } from "../entitybase";
export declare const BaseEntitySchema: {
    _id: {
        type: typeof Schema.Types.UUID;
        default: (this: {
            id: Schema.Types.UUID;
        }) => Schema.Types.UUID;
    };
    id: {
        type: typeof Schema.Types.UUID;
        required: boolean;
        unique: boolean;
    };
};
export declare const convertUUID: (id: UUID) => Schema.Types.UUID;
export declare class Get<T extends IEntity, ID extends Schema.Types.UUID> {
    protected readonly model: Model<T>;
    constructor(model: Model<T>);
    get(id: ID): Promise<T>;
}
export declare class Add<T extends IEntity> {
    protected readonly model: Model<T>;
    constructor(model: Model<T>);
    add(entity: T): Promise<void>;
}
export declare class Update<T extends IEntity, ID extends Schema.Types.UUID> extends Get<T, ID> {
    constructor(model: Model<T>);
    update(entity: T): Promise<void>;
}
export declare class Delete<T extends IEntity, ID extends Schema.Types.UUID> extends Get<T, ID> {
    constructor(model: Model<T>);
    delete(entity: T): Promise<void>;
}
