import chai, {expect} from "chai";
import chaiHttp from "chai-http";
import express, {Response} from "express";
import fs from "fs";
import {hawk, HawkRequest, predefinedBotlist} from "../src/express-hawk";

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
            });
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

    describe("it will be possible to pass your own botlists", () => {
        const ownListApp = express();
        ownListApp.use(hawk("my-own-defined-bot"));
        ownListApp.get("/match-test", (req: HawkRequest, res: Response) => {
            res.json({
                isBot: req.isBot
            });
        });

        it("should provide the bot-list as export", () => expect(predefinedBotlist)
            .eq(fs.readFileSync(__dirname + "/../user-agent.botlist", {encoding: "utf8"})));

        it("should find mentioned bots", (done) => void chai.request(ownListApp)
                .get("/match-test")
                .set("user-agent", "my-own-defined-bot")
                .send()
                .end((err, res) => {
                    expect(res.body.isBot).to.be.true;
                    done();
                })
        );
        it("should not find bots that were not mentioned", (done) => void chai.request(ownListApp)
            .get("/match-test")
            .set("user-agent", "my-not-defined-bot")
            .send()
            .end((err, res) => {
                expect(res.body.isBot).to.be.false;
                done();
            })
        );
    });
});
