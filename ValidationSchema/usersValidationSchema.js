import { object, string } from 'zod';

export const registerUserValidationSchema = object({
    body: object({
        name: string({
            required_error: 'Name is required',
        }),

        email: string({
            required_error: 'Email Address is required',
        })
            .email('Not a valid email address'),
        
        password: string({
            required_error: 'Password is required',
        })
            .min(6, 'Password is too Short - Password should be more than 6 characters long'),
    }),
});

export const loginUserValidationSchema = object({
    body: object({
        email: string({
            required_error: 'Email Address is required',
        })
            .email('Not a valid email address'),
        
        password: string({
            required_error: 'Password is required',
        })
            .min(6, 'Password is too Short - Password should be more than 6 characters long'),
    }),
});
