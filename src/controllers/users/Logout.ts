import { Request, Response } from "express";

export const logoutGet = (req: Request, res: Response) => {
    res.cookie('jwt', '', {maxAge: 1})
    res.redirect('/');
}