import {withStompedRabbit, StompedRabbit} from '../../../src/index';

@withStompedRabbit({config:{endpoint: 'ws://test:test@localhost:15674/ws'}})
class Test {

    mq:any;

    hasMQ() {
        return !!this.mq;
    }
}

(window as any).sr = new StompedRabbit();
(window as any).tt = new Test();