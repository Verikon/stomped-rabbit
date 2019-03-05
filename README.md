Usage:

import {withStompedRabbit} from 'stomped-rabbit';

@withStompedRabbit({
  config: {
    endpoint: 'ws://someserver.com'
    exchange: 'mydefaultexchange'
  }
  onConnect: 'onConnectSuccess' (points to the class method "onConnectSuccess"
  onConnectError: 'onConnectFailure' (points to the class method "onConnectError"
})
class myClass {
 ...
 
 onConnectSuccess( ) {
 
 }
 
 onConnectError( ) {
 
 }
}
