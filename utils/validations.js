import { body } from 'express-validator';

export const loginValidator = [
  body('email', 'Wrong email format').isEmail(),
  body('password', 'Password should be at least 5 symbols').isLength({ min: 5}),
];

export const registerValidator = [
  body('email', 'Wrong email format').isEmail(),
  body('password', 'Password should be at least 5 symbols').isLength({ min: 5}),
  body('fullName', 'Set your name').isLength({ min: 3}),
  body('avatarUrl', 'Wrong avatar url').optional().isURL(),
];

export const postCreateValidator = [
  body('title', 'Input post title').isLength({ min: 3}).isString(),
  body('text', 'Input post text').isLength({ min: 10}).isString(),
  body('tags', 'Wrong tags format').optional().isString(),
  body('imageUrl', 'Wrong image url').optional().isString(),
];