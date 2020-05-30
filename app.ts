//https://webrtc.org/getting-started/peer-connections


const ws = new WebSocket('ws://localhost:8080');

function getUrlVars() {
    var urlParams = new URLSearchParams(window.location.search);

    urlParams.forEach((val, key) => {
        console.log(`${key}: ${val}`);
    })
    return urlParams;
}


ws.onopen = (event) => {
    ws.onmessage = (e) => {
        
    makeCall()
        console.log(e, event);
    };
    ws.send(JSON.stringify({ message: "something",user: getUrlVars().get("user") }))
    ws.send(JSON.stringify({ message: "something2", user: getUrlVars().get("user")}))
}
console.log(this);

const constraints: MediaStreamConstraints = {
    audio: { echoCancellation: true },
    video: {},
}

const openMediaDevices = async (constraints: MediaStreamConstraints) => {
    return await navigator.mediaDevices.getUserMedia(constraints);

}

try {
    const stream = openMediaDevices({ 'video': true, 'audio': true });
    console.log('Got MediaStream:', stream);
    //const canvas = document.createElement("canvas");
    //canvas.
    const video = document.createElement("video");
    stream.then((mediaStream: MediaStream) => {
        video.srcObject = mediaStream;
        video.autoplay = true;
        video.controls = true;
        video.muted = true;
    });

    document.body.appendChild(video);

} catch (error) {
    console.error('Error accessing media devices.', error);
}


setInterval(() => {

})


async function makeCall() {
    const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
    const peerConnection = new RTCPeerConnection(configuration);
    ws.addEventListener('message', async message => {
        console.log(message);
        
        /*if (message.answer) {
            const remoteDesc = new RTCSessionDescription(message.answer);
            await peerConnection.setRemoteDescription(remoteDesc);
        }*/
    });
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    ws.send(JSON.stringify({'offer': offer}));
}
