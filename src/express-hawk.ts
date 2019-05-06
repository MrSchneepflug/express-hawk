import {NextFunction, Request, Response} from "express";
import fs from "fs";

export interface HawkRequest extends Request {
    isBot?: boolean;
}

function hawk() {
    const blacklistContent = fs.readFileSync(__dirname + "/../user-agent.blacklist", {encoding: "utf8"});
    const blacklist = blacklistContent.trim().split("\n");
    const blacklistRegex = new RegExp(blacklist.join("|"));

    return (req: HawkRequest, res: Response, next: NextFunction) => {
        // The user-agent could be undefined. This is fine since the test-method will return false for undefined.
        req.isBot = blacklistRegex.test(req.headers["user-agent"] as any);
        next();
    };
}

export {hawk};
