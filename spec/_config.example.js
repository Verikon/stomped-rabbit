/**
 * Place this file in ~/spec/private/_config.js
 * 
 * nb. the private directory is on the .gitignore, so feel free to place multiple configs in there.
 */

export default {
	mq: {
		endpoint: 'ws://user:pass@rabbitMQ:15672/stomp/websocket',
		exchange: 'your_exchange',
		proxy: '/stomp/websocket'
	}
}