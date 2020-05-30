
export class MediaStreamFactory {

    constructor() {

    }

    async request(){
        //type MediaStreamConstraints
        return await navigator.mediaDevices.getUserMedia({ 'video': true, 'audio': true });
    }

}