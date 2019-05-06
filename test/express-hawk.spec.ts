import chai, {expect} from "chai";
import chaiHttp from "chai-http";
import express, {Response} from "express";
import {hawk, HawkRequest} from "../src/express-hawk";

chai.use(chaiHttp);

describe("express-hawk is an express-middleware", () => {
    const app = express();
    app.use(hawk());

    it("will attach an 'isBot'-property to the request-object", (done) => {
        app.get("/", (req: HawkRequest, res: Response) => {
            const hasIsBotProperty = req.hasOwnProperty("isBot");
            res.json({hasIsBotProperty});
        });

        chai.request(app).get("/").send().end((err, res) => {
            expect(res.body.hasIsBotProperty).to.be.true;
            done();
        });
    });

    describe("will use a list of user-agents from a file included in this library (user-agent.blacklist)", () => {
        app.get("/match-test", (req: HawkRequest, res: Response) => {
            res.json({
                isBot: req.isBot
            })
        });

        it("will set 'isBot' to false if the user-agent does not match", (done) => {
            chai.request(app)
                .get("/match-test")
                .set("user-agent", "Mozilla/5.0 Chrome/73.0.3683.86 Safari/537.36")
                .send()
                .end((err, res) => {
                    expect(res.body.isBot).to.be.false;
                    done();
                });
        });

        it("will set 'isBot' to true if the user-agent matches", (done) => {
            chai.request(app)
                .get("/match-test")
                .set("user-agent", "Zombie.js")
                .send()
                .end((err, res) => {
                    expect(res.body.isBot).to.be.true;
                    done();
                });
        });
    });
});
