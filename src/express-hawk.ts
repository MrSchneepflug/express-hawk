import {NextFunction, Request, Response} from "express";
import fs from "fs";

export interface HawkRequest extends Request {
    isBot?: boolean;
}

function hawk(botlistContent = predefinedBotlist) {
    const botlistRegex = new RegExp(botlistContent.trim().split("\n").join("|"));

    return (req: HawkRequest, res: Response, next: NextFunction) => {
        // The user-agent could be undefined. This is fine since the test-method will return false for undefined.
        req.isBot = botlistRegex.test(req.headers["user-agent"] as string | undefined || "");
        next();
    };
}

export const predefinedBotlist = fs.readFileSync(__dirname + "/../user-agent.botlist", {encoding: "utf8"});

export {hawk};
