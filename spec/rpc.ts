import 'mocha';
import * as path from 'path';
import {execSync} from 'child_process';
import * as puppeteer from 'puppeteer-core';
import * as Bundler from 'parcel-bundler';
import * as isWSL from 'is-wsl';


describe(`RPC Tests`, function() {

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

        it(`Starts the test web server`, async () => {

            const entry = path.resolve('spec', 'serve', 'rpc', 'rpc.html');
            parcel = new Bundler(entry);
            await parcel.serve();
        });

        it(`Removes any occurace of chromes cache from a previously failed test`, () => {

            if (isWSL) {
                // Delete cache before testing in case earlier tests were aborted and the cleanup test was missed
                killChromeCache(chromeOptions.userDataDir);
            }
    
        });

        it('Spins up Puppeteer, test load page', async () => {

            browser = await puppeteer.launch(chromeOptions);
            page = await browser.newPage();

            await page.goto('http://localhost:1234');

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

            if (isWSL) {
                // Delete cache before testing in case earlier tests were aborted and the cleanup test was missed
                killChromeCache(chromeOptions.userDataDir);
              }
        })
    });

});


const killChromeCache = ( directory:string ) => {

    try {

        execSync(`rm -rf ${directory}`);
    } catch(e) {

        throw Error("Failed to delete user cache! Make sure all test instances of Chrome are closed.");
    }

};