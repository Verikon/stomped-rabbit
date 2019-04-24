//import {StompedRabbit} from '@src/StompedRabbit';
import {StompedRabbit} from '../../../src/StompedRabbit';

(window as any).sr = new StompedRabbit();

(window as any).provTest = args => {

    if(!args)
        console.error('provTest got no arguments')
    
    if(typeof args.number !== 'number')
        console.error('provTest got an invalid number type on {number:<value>) - expected "number" but got ' +typeof args.number);

    return {result:args.number+2};
}