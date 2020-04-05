# Initial join happy path

Send message via HTTP or websocket

{
  "action": "join-request",
  "latitude": "49.0",
  "longitude": "-123.0",
  "peerId": "abcdef"
}

Response:

{
  h3Hex: "#ffdfdfd",
  peers: {
    "#fdabcde": "peerId",
    "#fdabcde": "peerId",
    "#fdabcde": "peerId"
  }
}

Peer should start WebRTC. If there are peers, it
should dial all the peers.

For now, all peers will be expected to connect via webrtc-star signalling server.

In the future, the websocket/http signalling will only be used for initial bootstrap,
it will relay messages to webrtc. Once bootstrapped, future signalling will only
occur with webrtc. The bootstrap server will only be able to relay join requests
and signalling back-and-forth for the first connection. The bootstrap server will
not do discovery, but it will participate in the heirarchical routing at a h3 hex
address based on lat/long address.

