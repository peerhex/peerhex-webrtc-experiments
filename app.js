const WStar = require('libp2p-webrtc-star')
const multiaddr = require('multiaddr')
const pipe = require('it-pipe')
const { collect } = require('streaming-iterables')

console.log('Jim1')

const addr = multiaddr('/ip4/127.0.0.1/tcp/9090/ws/p2p-webrtc-star/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSooo2a')

const ws = new WStar({ upgrader })

/*
const listener = ws.createListener((socket) => {
  console.log('new connection opened')
  pipe(
    ['hello'],
    socket
  )
})

await listener.listen(addr)
console.log('listening')

const socket = await ws.dial(addr)
const values = await pipe(
  socket,
  collect
)

console.log(`Value: ${values.toString()}`)

// Close connection after reading
await listener.close()
*/