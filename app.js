import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { html } from 'htm/react'
import Libp2p from 'libp2p'
import WebRTCStar from 'libp2p-webrtc-star'
import Secio from 'libp2p-secio'
import Mplex from 'libp2p-mplex'

function App (props) {
  const [logs] = useState([])
  const [_, forceUpdate] = useState(0)
  const [peerId, setPeerId] = useState(null)
  const [peers] = useState({})
  const [libp2p, setLibp2p] = useState(null)

  function log (txt) {
    logs.push(txt)
    forceUpdate(Date.now())
  }

  function addPeer (peerInfo) {
    const peerId = peerInfo.id.toB58String()
    if (!peers[peerId]) {
      peers[peerId] = {
        peerInfo: peerInfo,
        connected: false
      }
      forceUpdate(Date.now())
    }
    return peers[peerId]
  }

  function connectPeer (peerInfo) {
    const peer = addPeer(peerInfo)
    peer.connected = true
  }

  function disconnectPeer (peerInfo) {
    const peer = addPeer(peerInfo)
    peer.connected = false
  }

  useEffect(() => {
    async function run () {
      const libp2p = await Libp2p.create({
        modules: {
          transport: [WebRTCStar],
          connEncryption: [Secio],
          streamMuxer: [Mplex]
        },
        config: {
          peerDiscovery: {
            autoDial: false
          }
        }
      })
      setPeerId(libp2p.peerInfo.id.toB58String())

      const webrtcAddr = '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star'
      libp2p.peerInfo.multiaddrs.add(webrtcAddr)

      libp2p.on('peer:discovery', peerInfo => {
        log(`Found peer ${peerInfo.id.toB58String()}`)
        addPeer(peerInfo)
      })

      // Listen for new connections to peers
      libp2p.on('peer:connect', peerInfo => {
        log(`Connected to ${peerInfo.id.toB58String()}`)
        connectPeer(peerInfo)
      })

      // Listen for peers disconnecting
      libp2p.on('peer:disconnect', peerInfo => {
        log(`Disconnected from ${peerInfo.id.toB58String()}`)
        disconnectPeer(peerInfo)
      })

      await libp2p.start()
      setLibp2p(libp2p)
    }
    run()
  }, [])
  return html`
    <div>
      PeerId: ${peerId}
      <h3>Peers</h3>
      <ul>
        ${Object.keys(peers).map(peerId => {
          const peer = peers[peerId]
          return html`
            <li key=${peerId}>
              ${peerId.slice(-3)} ${peer.connected ? 'Connected' : 'Disconnected'}
              ${!peer.connected &&
                html`
                  <button onClick=${connect}>Connect</button>
                `}
            </li>
          `
          function connect () {
            console.log('Jim connect', peerId, peer)
            async function dial () {
              log(`Dialing ${peerId}`)
              const conn = await libp2p.dial(peer.peerInfo)
              log(`Dialed ${peerId}`)
              console.log('Jim dialed', peerId, conn)
            }
            dial()
          }
        })}
      </ul>
      <h3>Logs</h3>
      ${logs.map((line, i) => {
        return html`
          <div key=${i}>${line}</div>
        `
      })}
    </div>
  `

}

const appEl = document.getElementById('app')
ReactDOM.createRoot(appEl).render(
  html`
    <${App} />
  `
)
