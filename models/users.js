import { Schema, model } from 'mongoose';

export const usersSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        whatYouLove: {
            type: [String],
            required: false,
        },
        whatTheWorldNeeds: {
            type: [String],
            required: false,
        },
        WhatYouCanBePaidFor: {
            type: [String],
            required: false,
        },
        WhatYouAreGoodAt: {
            type: [String],
            required: false,
        },

    }
);

export const UsersModel = model(
    'Users',
    usersSchema,
);