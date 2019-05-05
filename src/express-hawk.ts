import {NextFunction, Request, Response} from "express";

declare global {
    namespace Express {
        export interface Request {
            isBot: boolean;
        }
    }
}

function hawk() {
    return (req: Request, res: Response, next: NextFunction) => {
        req.isBot = true;
        next();
    };
}

export {hawk};
