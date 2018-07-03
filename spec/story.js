import serve from 'webpack-serve';
import puppeteer from 'puppeteer';
import {assert} from 'chai';

import _config from './private/_config';
import config from './rig/webpack.config.js';

import {StompedRabbit} from '../src';

let _realObject = obj => { return (!!obj) && (obj.constructor === Object); };

const test_config = {
	chrome: {
		headless:false,
		devtools: true
	},
	mq: _config.mq
}

describe('Class Tests', function() {

	this.timeout('15s');

	let Server,
		Browser,
		Page,
		Instance;

	describe('Testsuite preparation', () => {

		it('Spins up the test server', function(done) {

			serve({config}).then(server => {
				Server = server;
				Server.on('listening', ({server, options}) => {
					done();
				});
			});

		});

		it('Spins up puppeteer', async () => {

			Browser = await puppeteer.launch(test_config.chrome);
			Page = await Browser.newPage();
			await Page.goto('http://localhost:8000');
		});

	});

	describe('Method Tests', () => {

		it('Instantiates', () => {

			Instance = new StompedRabbit();
			assert(Instance instanceof StompedRabbit, 'not an instance.');
		});

		describe('StompedRabbit::configure', () => {

		});

		describe('StompedRabbit::parseEndpoint', () => {

			it('Method exists', () => {

				assert(typeof Instance.parseEndpoint === 'function', 'failed');
			})

			it('Parses endpoint `ws://someplace`', () => {

				let result = Instance.parseEndpoint('ws://someplace');
				assert(_realObject(result), 'failed - result not an object');
				assert(result.user === null, 'user was not null');
				assert(result.pass === null, 'password was not null');
				assert(result.uri === 'ws://someplace', 'unexpected endpoint');
			});

			it('Parses endpoint `wss://someplace`', () => {

				let result = Instance.parseEndpoint('wss://someplace');
				assert(_realObject(result), 'failed - result not an object');
				assert(result.user === null, 'user was not null');
				assert(result.pass === null, 'password was not null');
				assert(result.uri === 'wss://someplace', 'unexpected endpoint');
			});

			it('Parses endpoint `wss://user:pass@someplace.com:9999`', () => {

				let result = Instance.parseEndpoint('wss://user:pass@someplace.com:9999');
				assert(_realObject(result), 'failed - result not an object');
				assert(result.user === 'user', 'user was not null');
				assert(result.pass === 'pass', 'password was not null');
				assert(result.uri === 'wss://someplace.com:9999', 'unexpected endpoint');
			})

		});

		describe('StompedRabbit::clientId', () => {

			let id, newid;

			it('Method exists', () => {

				assert(typeof Instance.clientId === 'function', 'failed');
			});

			it('Generates a client Id of first invocation', () => {

				id = Instance.clientId();
				assert(typeof id === 'string' && id.length, 'id was not a string, or was empty');
			});

			it('Gets sent the same Id on second invocation', () => {

				let tid = Instance.clientId();
				assert(tid === id, 'ids were not the same');
			});

			it('Gets a new id when argued to refresh', () => {

				newid = Instance.clientId(true);
				assert(newid !== id, 'ids were the same');
			});

			it('Gets the new id when invoked a second time', () => {

				let tid = Instance.clientId();
				assert(tid === newid, 'id was not the new/refreshed one');
			});
		});

	});

	describe('Browser Tests', () => {

		describe('Ready check and setup', () => {

			it('Page loaded correctly', async () => {

				let result;
				
				result = await Page.evaluate(function() { return window.ready; });
				assert(result === 111, 'window.ready expected to return 111');

				result = await Page.$eval('#testit', el => el.textContent);
				assert(result === 'loaded', 'expected the index.html #testit to have `loaded` textContent');
			});

			it('Loaded StompedRabbit', async () => {

				let result;
				result = await Page.evaluate(function() { return !!window.StompedRabbitRef });
				assert(result === true, 'StompedRabbit didnt have a reference on window.StompedRabbitRef ');
			});

		});

		describe('StompedRabbit', () => {

			describe('Instantiation', () => {

				it('Instances StompedRabbit with no props', async () => {

					let result = await Page.evaluate(() => {
						window.instance = new StompedRabbitRef();
					});
				});
			});

			describe('Configuration', () => {

				it('Instantion has a configure method', async () => {

					let result = await Page.evaluate(() => {
						return typeof window.instance.configure;
					});

					assert(result === 'function', 'configuration method does not exist on instance');
				});

				it('invokes StompedRabbit::configure with expected arguments', async () => {
				
					let result = await Page.evaluate(config => {
						return window.instance.configure(config);
					}, test_config.mq);

					assert(_realObject(result), 'result not an object');
					assert(result.success === true, 'did not indicate success');
				});

				it('Configured as expected', async () => {

					let result = await Page.evaluate(() => {
						return window.instance.config
					});

					assert(_realObject(result), 'config was not an object');
					assert(typeof result.endpoint === 'string' && result.endpoint.length, 'config.endpoint not as expected');
					assert(typeof result.exchange === 'string' && result.exchange.length, 'config.exchange not as expected');
					assert(typeof result.proxy === 'string' && result.proxy.length, 'config.proxy not as expected');
					assert(typeof result.heartbeat_incoming === 'number', 'config.heartbeat_incoming not as expected');
					assert(typeof result.heartbeat_outgoing === 'number', 'config.heartbeat_outgoing not as expected');
					assert(_realObject(result.auth), 'expected config.auth to be an object');
					assert(result.auth.user !== undefined, 'expected result.auth.user to be defined');
					assert(result.auth.pass !== undefined, 'expected result.auth.pass to be defined');
					assert(typeof result.auth.pass === 'string' && result.auth.pass.length, 'config.endpoint not as expected');
				});

			});

			describe('Connection', () => {

				it('Connects', async () => {

					let result = await Page.evaluate( () => {
						return new Promise((res, rej) => {
							window.instance.connect()
								.then(r => { res(r); });
						});
					});

					assert(result === true, 'failed');
				});
			});

			describe('Patterns', () => {

				describe('Fire and Forget (FNF)', () => {

				});

				describe('Remote Procedure Call (RPC)', () => {

					it('Has the rpc pattern', async () => {

						let result = await Page.evaluate(() => {
							return typeof window.instance.rpc;
						});

					});

					it('RPC pattern has a provision method', async () => {

						let result = await Page.evaluate(() => {
							return typeof window.instance.rpc.provision;
						})

						assert(result === 'function', 'rpc.provision does not exist');

					});

					it('RPC pattern has a deprovision method', async () => {

						let result = await Page.evaluate(() => {
							return typeof window.instance.rpc.deprovision;
						})
						assert(result === 'function', 'rpc.deprovision does not exist');
					});

					it('RPC pattern has an invoke method', async() => {

						let result = await Page.evaluate(() => {
							return typeof window.instance.rpc.invoke;
						})
						assert(result === 'function', 'rpc.invoke does not exist');
					});

					it('Provisions a test endpoint', async () => {

						let result = await Page.evaluate(() => {

							return new Promise((resolve,reject) => {
								instance.rpc.provision('stomped_rpc_test_listener', args => { return args.val1 + args.val2; })
									.then(resp => { resolve(resp); })
							});

						});

					});

					it('Invokes the test endpoint', async () => {

						let result = await Page.evaluate(() => {

							return new Promise((resolve, reject) => {
								instance.rpc.invoke('stomped_rpc_test_listener', {val1:3, val2:5})
									.then(resp => {
										
										if(instance.provisions.stomped_rpc_test_listener === undefined)
											reject({success: false, error: 'did not attach a provision to main'});
										
										resolve(resp);
									});
							})
						});

						assert(result.success === true, 'did not indicate success');
						assert(result.result === 8, 'expected a result of 8');
					});

					it('Deprovisions the test endpoint', async() => {

						let result = await Page.evaluate(() => {

							return new Promise((resolve,reject) => {
								instance.rpc.deprovision('stomped_rpc_test_listener')
									.then(resp => {
										if(instance.provisions.stomped_rpc_test_listener !== undefined)
											reject({success: false, error: 'did not detach a provision to main'});	
										resolve(resp);
									});
							})
						});

						assert(_realObject(result), 'result not an object');
						assert(result.success === true, 'did not indicate success');
					});
				});

				describe('PubSub', () => {

					it('Has the pubsub pattern', async () => {

						let result = await Page.evaluate(() => {
							return typeof window.instance.pubsub;
						});
					});

					it('PubSub pattern has a subscribe method', async () => {

						let result = await Page.evaluate(() => {
							return typeof window.instance.pubsub.subscribe;
						})

						assert(result === 'function', 'pubsub.subscribe does not exist');

					});

					it('PubSub pattern has a unsubscribe method', async () => {

						let result = await Page.evaluate(() => {
							return typeof window.instance.pubsub.unsubscribe;
						})
						assert(result === 'function', 'pubsub.unsubscribe does not exist');
					});

					it('PubSub pattern has an publish method', async() => {

						let result = await Page.evaluate(() => {
							return typeof window.instance.pubsub.publish;
						})
						assert(result === 'function', 'pubsub.publish does not exist');
					});

					describe('No exchange', () => {

					});

					describe('Fanout exchange', () => {

					});

					describe('Topic exchange', () => {

					});

					it('Subscribes')
				});

			});

			describe('Parse Endpoint', () => {

			});
		})

	});

	describe('Test-suite cleanup', () => {

		it('Closes Puppeteer', () => {

			return Browser.close();
		});

		it('Spins down the test server', () => {

			return Server.close();
		})
	});

});