export interface Config {
    heartbeat_incoming: number; //milliseconds for incoming heartbeats.
    heartbeat_outgoing: number; //milliseconds for incoming heartbeats.
    direct: string; //a default direct exchange name for the application (must be present on the rabbitMQ server).
    topic: string; //a default topic exchange name for the application (must be present on the rabbitMQ server).
    fanout: string; //a default fanout exchange name for the application (must be present on the rabbitMQ server).
    exchange: string; //a default exchange
    queues: Array<Queue>; //queues to actualise upon connection.
    endpoint: string; //the endpoint uri ( eg ws://someone:secret@rabbithost:port/stomp/websocket )
    auth: Endpoint; //the parsed endpoint
    debug: boolean; //run this instance in debug mode.
}

export interface ArguedConfig extends Config {
}

export interface InstanceConfig extends Config {
    auth: Endpoint;
}

export interface Success {
    success: boolean;
}

export interface Endpoint {
    user: string;
    pass: string;
    uri: string;
}

export interface Queue {
    pattern: string;
    type: string; //the type of queue "fanout"|"direct"|"topic"
    name: string; //the name or topic pattern for this queue
    listener: Function; //the function to listen upon the queue with.
}

export interface ClientOptions {
    exchange?:string;
    debug?:boolean;
}