import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { UsersModel } from "../models/users.js";
import { createUser, fetchUser, userFindOne, userUpdateOne } from "../Services/usersServices.js";
import { loginUserValidationSchema, registerUserValidationSchema } from "../ValidationSchema/usersValidationSchema.js";

const SECRET_KEY = 'THE_IKIGAI_SECRET';
const saltRounds = 10;

export const getAllUserData = async (req, res) => {

    try {

        let input = JSON.parse(JSON.stringify(req.query));

        if(!input.token) {

            return res
                .json({
                    status: false,
                    message: 'Login Expired. Please login again to proceed!',
                });

        }

        const decodedToken = jwt.verify(input.token, SECRET_KEY);

        if(!decodedToken?.data?.email) {

            return res
                .json({
                    status: false,
                    message: 'Login Expired. Please login again to proceed!',
                });

        }

        const users = await UsersModel.find();

        return res
            .json({
                status: true,
                message: 'Users data fetched successfully',
                data: users,
                userEmail: decodedToken?.data?.email
            });
    
    } catch (error) {

        console.log({
            catchError: error,
        })

        return res
            .json({
                status: false,
                message: 'Error fetching users data!',
            });

    }

};

export const registerUserHandler = async (req, res) => {

    try {
        
        let input = JSON.parse(JSON.stringify(req.body));

        const inputValidation = registerUserValidationSchema
            .safeParse({
                body: input,
            });

        if(!inputValidation.success) {

            console.error({
                type: 'ERROR',
                message: 'Input validation Error',
                inputValidation
            });

            return res  
                .json({
                    status: false,
                    message: JSON.parse(JSON.stringify(inputValidation))
                });

        }

        bcrypt.hash(
            input.password,
            saltRounds, 
            async (err, hash) => {

                if(err) {

                    console.error({
                        message: 'Error generating password',
                        error: err,
                    });

                    return res
                        .json({
                            status: false,
                            message: 'Error registering! Please try again later'
                        })

                }

                input.password = hash;

                const user = await createUser(input);
                
                if(user?.status === false) {

                    console.error({
                        message: 'Email already exists',
                    })

                    return res
                        .json({
                            status: false,
                            message: 'Email address already exists!',
                        });

                } if(user?.status === true) {

                    const token = jwt.sign({
                        data: {
                            email: user?.user?.email
                        },
                    },
                    SECRET_KEY,
                    {
                        expiresIn: '10h'
                    });

                    console.log({
                        token
                    })

                    const response = {
                        userEmail: user?.user?.email,
                        token: token,
                    };

                    return res
                        .json({
                            status: true,
                            message: 'User registration is successful',
                            response,
                        });

                } else {

                    return res
                        .json({
                            status: false,
                            message: 'Error registering user!',
                        });
                
                }

        });
        
    } catch (error) {

        console.log({
            error,
        })

        return res
            .json({
                status: false,
                message: 'Error registering user!',
            });

    }

};

export const loginUserHandler = async (req, res) => {

    try {

        let input = JSON.parse(JSON.stringify(req.body));

        const inputValidation = loginUserValidationSchema
            .safeParse({
                body: input,
            });

        if(!inputValidation.success) {

            console.error({
                type: 'ERROR',
                message: 'Input validation Error',
                inputValidation
            });

            return res  
                .json({
                    status: false,
                    message: JSON.parse(JSON.stringify(inputValidation))
                });

        }

        const query = {
            email: input.email,
        };

        const user = await fetchUser(query);

        console.log({
            input,
            user
        })

        bcrypt
            .compare(
                input?.password,
                user?.user?.password,
                (err, result) => {

                    if(result === true) {

                        const token = jwt.sign({
                            data: {
                                email: user?.user?.email
                            },
                        },
                        SECRET_KEY,
                        {
                            expiresIn: '10h'
                        });
            
                        console.log({
                            token
                        })
            
                        const response = {
                            userEmail: user?.user?.email,
                            token: token,
                        };
            
                        return res
                            .json({
                                status: true,
                                message: 'User login is successful',
                                response,
                            });

                    } else if(result === false) {

                        return res
                            .json({
                                status: false,
                                message: 'Invalid Email or Password entered',
                            });

                    }

                    return res
                    .json({
                        status: false,
                        message: 'Error Logging user in!',
                    }); 
                }
            );

    } catch (error) {

        console.log({
            catchError: error,
        })

        return res
            .json({
                status: false,
                message: 'Error Logging user in!',
            });

    }

};

export const addSingleValue = async (req, res) => {

    try {

        let input = JSON.parse(JSON.stringify(req.body));

        if(!input.token) {

            return res
            .json({
                status: false,
                message: 'Login Expired. Please login again to proceed!',
            });

        }

        if(!input.type) {

            return res
            .json({
                status: false,
                message: 'Error Saving values! | TYPE MISSING',
            });

        }

        if(input.values.length <= 0) {

            return res
                .json({
                    status: false,
                    message: 'No Values were added. Please enter value(s) to proceed.',
                }); 
        
        }

        const decodedToken = jwt.verify(input.token, SECRET_KEY);

        console.log({
            decodedToken,
            input,
        });

        if(!decodedToken?.data?.email) {

            return res
            .json({
                status: false,
                message: 'Login Expired. Please login again to proceed!',
            });

        }

        let query = {
            email: decodedToken?.data?.email,
        };

        let set = {
            [input?.type]: input?.values,
        };
        
        const result = await userUpdateOne(query, set);

        if(result?.status === true) {

            return res
                .json({
                    status: true,
                    message: 'Value updated'
                });

        }

        return res
            .json({
                status: false,
                message: 'Error Saving values!',
            });


    } catch (error) {

        console.log({
            catchError: error,
        })

        return res
            .json({
                status: false,
                message: 'Error Saving values!',
            });

    }

};

export const saveAllValues = async (req, res) => {

    try {

        let input = JSON.parse(JSON.stringify(req.body));

        console.log({
            input
        })

        if(!input.token) {

            return res
                .json({
                    status: false,
                    message: 'Login Expired. Please login again to proceed!',
                });

        }

        if(
            !input.whatYouLove ||
            !input.whatTheWorldNeeds ||
            !input.WhatYouCanBePaidFor ||
            !input.WhatYouAreGoodAt
            // !input.whatYouLove.length <= 0 ||
            // !input.whatTheWorldNeeds.length <= 0 ||
            // !input.WhatYouCanBePaidFor.length <= 0 ||
            // !input.WhatYouAreGoodAt.length <= 0
        ) {

            return res
                .json({
                    status: false,
                    message: 'No Values were added. Please enter value(s) to proceed.',
                }); 
        
        }

        const decodedToken = jwt.verify(input.token, SECRET_KEY);

        console.log({
            decodedToken,
            input,
        });

        if(!decodedToken?.data?.email) {

            return res
                .json({
                    status: false,
                    message: 'Login Expired. Please login again to proceed!',
                });

        }

        let query = {
            email: decodedToken?.data?.email,
        };

        let set = {
            whatYouLove: input.whatYouLove,
            whatTheWorldNeeds: input.whatTheWorldNeeds,
            WhatYouCanBePaidFor: input.WhatYouCanBePaidFor,
            WhatYouAreGoodAt: input.WhatYouAreGoodAt,
        };
        
        const result = await userUpdateOne(query, set);

        if(result?.status === true) {

            return res
                .json({
                    status: true,
                    message: 'Value updated'
                });

        }

        return res
            .json({
                status: false,
                message: 'Error Saving values!',
            });


    } catch (error) {

        console.log({
            catchError: error,
        })

        return res
            .json({
                status: false,
                message: 'Error Saving values!',
            });

    }

};

export const getUserData = async (req, res) => {

    try {

        let input = JSON.parse(JSON.stringify(req.query));

        if(!input.token) {

            return res
            .json({
                status: false,
                message: 'Login Expired. Please login again to proceed!',
            });

        }

        const decodedToken = jwt.verify(input.token, SECRET_KEY);

        console.log({
            decodedToken,
            input,
        });

        if(!decodedToken?.data?.email) {

            return res
            .json({
                status: false,
                message: 'Login Expired. Please login again to proceed!',
            });

        }

        let query = {
            email: decodedToken?.data?.email,
        };
        
        const result = await userFindOne(query);

        if(result?.status === true) {

            return res
                .json({
                    status: true,
                    message: 'user data fetched',
                    userData: result,
                });

        }

        return res
            .json({
                status: false,
                message: 'Error Saving values!',
            });


    } catch (error) {

        console.log({
            catchError: error,
        })

        return res
            .json({
                status: false,
                message: 'Error Saving values!',
            });

    }

};