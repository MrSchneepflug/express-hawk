import {NextFunction, Request, Response} from "express";
import fs from "fs";

export interface HawkRequest extends Request {
    isBot?: boolean;
}

function hawk(blacklistContent = predefinedBlacklist) {
    const blacklistRegex = new RegExp(blacklistContent.trim().split("\n").join("|"));

    return (req: HawkRequest, res: Response, next: NextFunction) => {
        // The user-agent could be undefined. This is fine since the test-method will return false for undefined.
        req.isBot = blacklistRegex.test(req.headers["user-agent"] as string | undefined || "");
        next();
    };
}

export const predefinedBlacklist = fs.readFileSync(__dirname + "/../user-agent.blacklist", {encoding: "utf8"});

export {hawk};
