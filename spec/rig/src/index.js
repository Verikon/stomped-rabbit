import path from 'path';

import {StompedRabbit, withStompedRabbit} from 'index'

@withStompedRabbit()
class MockClass1 { 

	constructor() {
		this.classtest = 1;
	}
}

@withStompedRabbit()
class MockClass2 {

	constructor() {
		this.classtest = 2;
	}
}

@withStompedRabbit({key: 'myMQ'})
class MockClass3 {

	constructor() {
		this.classtest = 3;
	}
}

async function MockFn1 () {

}

window.ready = 111;
window.StompedRabbitRef = StompedRabbit;
window.mc1 = new MockClass1();
window.mc2 = new MockClass2();
window.mc3 = new MockClass3();
