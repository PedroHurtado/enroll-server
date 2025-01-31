import { Schema } from "mongoose";
export const BaseEntitySchema = {
    _id: {
        type: Schema.Types.UUID,
        default: function () {
            return this.id;
        }
    },
    id: {
        type: Schema.Types.UUID,
        required: true,
        unique: true,
    }
};
export const convertUUID = (id) => {
    return id;
};
export class Get {
    constructor(model) {
        this.model = model;
    }
    async get(id) {
        const data = await this.model.findById(id).exec();
        if (data) {
            return data;
        }
        throw new Error("Data not found");
    }
}
export class Add {
    constructor(model) {
        this.model = model;
    }
    async add(entity) {
        await this.model.create(entity);
    }
}
export class Update extends Get {
    constructor(model) {
        super(model);
    }
    async update(entity) {
        await this.model.findByIdAndUpdate(entity.id, entity).exec();
    }
}
export class Delete extends Get {
    constructor(model) {
        super(model);
    }
    async delete(entity) {
        await this.model.findByIdAndDelete(entity.id).exec();
    }
}
