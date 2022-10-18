import { UsersModel } from "../models/users.js";

export async function createUser(input) {

    try {

        const user = await new UsersModel(input);

        await user.save();

        console.log({
            user
        })

        return {
            status: true,
            user: user,
        };

    } catch(error) {

        if(error?.code === 11000) {

            return {
                status: false,
                user: 'Email already exists!',
            };

        }

        return false;

    }

};

export async function fetchUser(query) {

    try {

        const user = await UsersModel
            .findOne(
                query,
            );

        return {
            status: true,
            user: user,
        };

    } catch (error) {

        return {
            status: false,
        }

    }

};

export async function userUpdateOne(query, set) {

    try {

        const result = await UsersModel
            .findOneAndUpdate(
                query,
                {
                    $set: set,
                },
                {
                    new: true
                }
            );

        if(!result) {

            return {
                status: true,
                message: 'values update failed',
            };

        }

        return {
            status: true,
            result: result,
        };

    } catch (error) {

        return {
            status: false,
        }

    }

};

export async function userFindOne(query) {

    try {

        const result = await UsersModel
            .findOne(
                query,
            );

        if(!result) {

            return {
                status: true,
                message: 'Error fetching user',
            };

        }

        return {
            status: true,
            result: result,
        };

    } catch (error) {

        return {
            status: false,
        }

    }

};