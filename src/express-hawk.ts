import {NextFunction, Request, Response} from "express";
import fs from "fs";

declare global {
    namespace Express {
        export interface Request {
            isBot: boolean;
        }
    }
}

function hawk() {
    const blacklistContent = fs.readFileSync(__dirname + "/../user-agent.blacklist", {encoding: "utf8"});
    const blacklist = blacklistContent.trim().split("\n");
    const blacklistRegex = new RegExp(blacklist.join("|"));

    return (req: Request, res: Response, next: NextFunction) => {
        req.isBot = blacklistRegex.test(req.headers["user-agent"] || "");
        next();
    };
}

export {hawk};
