# express-hawk

Express middleware written in Typescript for identifying requests of bots/crawlers.

[![Build Status](https://travis-ci.com/MrSchneepflug/express-hawk.svg?branch=master)](https://travis-ci.com/MrSchneepflug/express-hawk)
[![Coverage Status](https://coveralls.io/repos/github/MrSchneepflug/express-hawk/badge.svg?branch=master)](https://coveralls.io/github/MrSchneepflug/express-hawk?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/MrSchneepflug/express-hawk.svg)](https://greenkeeper.io/)

This library was inspired by [es6-crawler-detect](https://github.com/JefferyHus/es6-crawler-detect). The blacklist is taken from [Crawler-Detect](https://github.com/JayBizzle/Crawler-Detect).

## Installation

```sh
yarn add express-hawk
```

> **Note:**
> Please keep in mind that this is a very basic check because the user-agent-header is tampered easily.

## Usage

Use `express-hawk` as any other express-middleware.

```js
import express, {Request, Response} from "express";
import {hawk} from "express-hawk";

const app = express();
app.use(hawk());

app.get("/", (req: Request, res: Response) => {
    // req.isBot is now either true or false
});
```

The middleware uses the blacklist `user-agent.blacklist`. On each request it checks if the user-agent-header matches with an entry of this list. It sets `req.isBot` accordingly.

## Tests

```sh
$ yarn install
$ yarn test
```
