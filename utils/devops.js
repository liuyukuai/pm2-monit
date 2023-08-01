const axios = require('axios');

class Devops {
    constructor(options) {
        this.upload = options.domain + options.upload;
        this.status = options.domain + options.status;
        this.appId = options.appId;
        this.secret = options.secret;
    }

    sendEvent(content) {
        this.send(content, this.upload);
    }

    sendStatus(content) {
        this.send(content, this.status);
    }

    send(content, address) {
        if (!address || !this.appId || !this.secret) {
            console.log("the devops config is empty. ignore sending")
            return;
        }
        axios.post(`${address}?appId=${this.appId}&secret=${this.secret}`, content)
            .then(res => {
                console.log("devops sending success = " + JSON.stringify(res.data))
            })
            .catch(e => {
                console.log("devops sending error = " + e)
            });
    }
}

exports.Devops = Devops;