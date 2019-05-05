import chai, {expect} from "chai";
import chaiHttp from "chai-http";
import express, {Request, Response, NextFunction, Express} from "express";
import {hawk} from "../src/express-hawk";

chai.use(chaiHttp);

describe("express-hawk is an express-middleware", () => {
    let app: Express;

    before(() => {
        app = express();
        app.use(hawk());
    });

    it("will attach an 'isBot'-property to the request-object", (done) => {
        app.get("/", (req: Request, res: Response, next: NextFunction) => {
            const hasIsBotProperty = req.hasOwnProperty("isBot");
            res.json({hasIsBotProperty});
        });

        chai.request(app).get("/").send().end((err, res) => {
            expect(res.body.hasIsBotProperty).to.be.true;
            done();
        });
    });
});
