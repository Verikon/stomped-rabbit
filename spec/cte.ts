import 'mocha';
import {assert} from 'chai';

import * as path from 'path';
import {execSync} from 'child_process';
import * as puppeteer from 'puppeteer-core';
import * as Bundler from 'parcel-bundler';
import * as isWSL from 'is-wsl';
import * as isPortReachable from 'is-port-reachable';

describe(`CTE Tests`, function() {

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

            const entry = path.resolve('spec', 'serve', 'cte', 'index.html');
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

        it(`Ensures Stomped Rabbit has been instantied`, async () => {

            const result = await page.evaluate(() => (window as any).sr.constructor.name);
            assert(result === 'StompedRabbit', 'failed');
        });

        it(`Configures Stomped Rabbit`, async () => {

            const result = await page.evaluate(() => {
                return (window as any).sr.configure({endpoint:'ws://test:test@localhost:15674/ws', topic: 'test'})
            });

            assert(result.success === true, 'failed');
        });

        it('Connects Stomped Rabbit', async () => {

            const result = await page.evaluate(() => {
                return (window as any).sr.connect();
            });

            assert(result === true, 'failed');
        });

    });

    describe(`Tests`, () => {

        it('Sets up a listener on the "test" topic exchange', async () => {

            const result = await page.evaluate(_ => {
                return (window as any).sr.topic.provision('asset.test.*', message => {
                    (window as any).receivedDispatch = true;
                });
            });

            assert(result=== true, 'failed');
        });

        it('Provisions a "test_this" queue on the MQ which replys via the "test" exchange', async () => {

            const result = await page.evaluate(_ =>{
                return (window as any).sr.cte.provision('test_this', 'asset.test.*', (message, helpers) => {
                    helpers.mutateKey('asset.test.6');
                    (window as any).receivedMessage = true
                    return {success:true, it: "worked"};
                });
            });

            assert(result === true, 'failed');
        });

        it('Posts a message at the CTE queue', ( done ) => {

            page.evaluate(_=> (window as any).sr.cte.invoke('test_this', {test: true}))
                .then(_ => {
                    setTimeout(async _ =>{
                        const result = await page.evaluate(_=> {
                            return (window as any).receivedDispatch && (window as any).receivedMessage;
                        })
                        assert(result === true, 'failed');
                        done()
                    }, 1500);
                });

        });

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