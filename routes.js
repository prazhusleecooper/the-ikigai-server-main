import express from 'express';

import { addSingleValue, getAllUserData, getUserData, loginUserHandler, registerUserHandler, saveAllValues } from './Controller/UsersController.js';

const router = express.Router();


// ? Add Single Values
router.get(
    '/getAllUsers',
    getAllUserData,
);

// ? Register user
router.post(
    '/register',
    registerUserHandler,
);

// ? Register user
router.post(
    '/login',
    loginUserHandler,
);

// ? Add Single Values
router.patch(
    '/singleValues',
    addSingleValue,
);

// ? Add All Values
router.patch(
    '/allValues',
    saveAllValues,
);

// ? Add Single Values
router.get(
    '/getUser',
    getUserData,
);

export default router;