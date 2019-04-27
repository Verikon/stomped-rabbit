import 'mocha';
import {assert} from 'chai';

import * as path from 'path';
import {execSync} from 'child_process';
import * as puppeteer from 'puppeteer-core';
import * as Bundler from 'parcel-bundler';
import * as isWSL from 'is-wsl';
import * as isPortReachable from 'is-port-reachable';

describe(`Hook Tests`, function() {

    this.timeout('15s');

    const chromeOptions = isWSL
        ? { //WSL options
            devtools: true,
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

            const entry = path.resolve('spec', 'serve', 'hook', 'index.html');
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

        it('Ensure the hook function has been loaded', async () => {

            const result = await page.evaluate( _ => typeof (window as any).USR);
            assert(result === 'function', 'failed');
        });

        it(`Attempts use with the local mq`, async () => {

            const config = {
                endpoint:'ws://test:test@localhost:15674/ws'
            };

            const result = await page.evaluate( config => {
                return (window as any).USR('test', config).then(inst => (window as any).mq = inst);
            }, config);
        });

        it(`Provisions an RPC listener to test`, async () => {

            const result = await page.evaluate(_ => {
                return (window as any).mq.rpc.provision('test_hook_rpc', message => message.val + 1);
            });

            assert(result.success === true, 'failed');
        });

        it(`Messages the provisioned listener and gets the expected return`, async () => {

            const result = await page.evaluate(_=> {
                return (window as any).mq.rpc.invoke('test_hook_rpc', {val:1})
            });

            assert(result === 2, 'failed');
        });
    });

    describe.skip(`Cleanup`, () => {

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