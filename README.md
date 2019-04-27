Usage:

### as Hook
import {useStompedRabbit} from 'stomped-rabbit';


const mq = await useStompedRabbit('main', {endpoint: 'ws://user:pass@somewhere:15672', config options});


import {withStompedRabbit} from 'stomped-rabbit';

```
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
```

###RPC
####Provision
SR.rpc.provision()