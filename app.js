import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { html } from 'htm/react'
import Libp2p from 'libp2p'
import WebRTCStar from 'libp2p-webrtc-star'
import Secio from 'libp2p-secio'
import Mplex from 'libp2p-mplex'
import produce from 'immer'

function App (props) {
  const [logs] = useState([])
  const [_, forceUpdate] = useState(0)

  function log (txt) {
    logs.push(txt)
    forceUpdate(Date.now())
  }

  useEffect(() => {
    async function run () {
      const libp2p = await Libp2p.create({
        modules: {
          transport: [WebRTCStar],
          connEncryption: [Secio],
          streamMuxer: [Mplex]
        }
      })

      const webrtcAddr = '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star'
      libp2p.peerInfo.multiaddrs.add(webrtcAddr)

      libp2p.on('peer:discovery', peerInfo => {
        log(`Found peer ${peerInfo.id.toB58String()}`)
      })

      // Listen for new connections to peers
      libp2p.on('peer:connect', peerInfo => {
        log(`Connected to ${peerInfo.id.toB58String()}`)
      })

      // Listen for peers disconnecting
      libp2p.on('peer:disconnect', peerInfo => {
        log(`Disconnected from ${peerInfo.id.toB58String()}`)
      })

      await libp2p.start()
    }
    run()
  }, [])
  return html`
    <div>
      <h3>Logs</h3>
      ${logs.map((line, i) => {
        return html`<div key=${i}>${line}</div>`
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
