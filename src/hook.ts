import assert from 'assert';

import {ArguedConfig} from './types';

import {StompedRabbit} from './StompedRabbit';

let instance = {};

export async function useStompedRabbit( args:any ):Promise<StompedRabbit> {

    args = args || {};
    
    const id = args.id || 'main';
    const config = args.config || null;

    //simple request for an SR instance.
    if(instance[id] && !config)
        return instance[id];

    //request for a non-existing id, and not attempting to configure it.
    if(!instance[id] && !config)
        throw new Error(err(`instance with id:"${id}" does not exist, configure it`));

    //request for an SR instance which exists, but attempting to configure it.
    if(instance[id] && config) {
        console.warn(`stomped-rabbit: instance with id${id} already exists, you're attempting to configure it`);
        return instance[id];
    }

    if(!instance[id] && config) {
        await configure(id, config);
        return instance[id];
    }

}

export async function configure( id:string, config:ArguedConfig ):Promise<boolean> {

    if(instance && instance[id])
        throw new Error(`StompedRabbit: instance "${id}" already exists`);

    let result;

    instance[id] = new StompedRabbit();

    result = instance[id].configure(config);
    assert(result.success, err('failed to configure.'));

    result = await instance[id].connect();
    assert(result, err('failed to connect'));

    return true;
}

function err( message:string ) {

    return `StompedRabbit:: ${message}`;
}