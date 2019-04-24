import 'mocha';
import {assert} from 'chai';

import * as path from 'path';
import {execSync} from 'child_process';
import * as puppeteer from 'puppeteer-core';
import * as Bundler from 'parcel-bundler';
import * as isWSL from 'is-wsl';
import * as isPortReachable from 'is-port-reachable';

describe(`Decorator Tests`, function() {

    this.timeout('15s');

    const chromeOptions = isWSL
        ? { //WSL options
            devtools: false,
            headless: false,
            executablePath: 'chrome.exe',
            userDataDir: '.chrome-cache' // Had (permissions?) issues with absolute path -- relative path works fine
        }
        : {}; //linux options

    let parcel,
        browser,
        page;

    describe(`Preparation`, () => {

        it(`Ensures we have the test RabbitMQ up`, async () => {

            const result = await isPortReachable(15672, {host: 'localhost'});
            assert(result === true, 'failed - run `yarn up` to spin up the test container');
        });

        it(`Starts the test web server`, async () => {

            const entry = path.resolve('spec', 'serve', 'decorator', 'index.html');
            parcel = new Bundler(entry);
            await parcel.serve();
        });

        it(`Removes any occurace of chromes cache from a previously failed test`, () => {

            if(isWSL)
                killChromeCache(chromeOptions.userDataDir);
        });

        it('Spins up Puppeteer, test load page', async () => {

            browser = await puppeteer.launch(chromeOptions);
            page = await browser.newPage();

            await page.goto('http://localhost:1234');

            const result = await page.evaluate(() => {
                return document.querySelector('#readycheck').textContent;
            });

            assert(result === 'Ready', 'failed');
        });

    });

    describe(`Tests`, () => {

        it(`Ensures Stomped Rabbit has been instantied`, async () => {

            const result = await page.evaluate(() => (window as any).sr.constructor.name);
            assert(result === 'StompedRabbit', 'failed');
        });

        it(`Test class has the messageQueue`, async () => {

            const result = await page.evaluate(_=>{
                return (window as any).tt.hasMQ();
            })

            assert(result === true, 'failed');
        })
    });

    describe(`Cleanup`, () => {

        it(`Closes the browser`, async () => {

            await browser.close();
        });

        it(`Stops the test web server`, async () => {

            await parcel.stop();
        });

        it(`Removes teh chrome cache`, () => {

            if(isWSL)
                killChromeCache(chromeOptions.userDataDir);
        });

    });

});


const killChromeCache = ( directory:string ) => {

    try {

        execSync(`rm -rf ${directory}`);
    } catch(e) {

        throw Error("Failed to delete user cache! Make sure all test instances of Chrome are closed.");
    }

};