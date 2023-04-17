const axios = require('axios');

class Work {
    baseUrl = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=';

    constructor(options, config) {
        this.keys = options.keys.split(',');
    }

    sendEvent(content) {
        let title = `**服务名称: ${content.service}**\n**主机: ${content.ip}**\n**项目: ${content.projectName}**\n**时间: ${content.time}** \n**SpanId: ${content.spanId}**  \n\n`;
        content = title + '<font color=\"comment\">' + this.getDesc(content) + '</font>'
        this.keys.forEach(key => {
            axios.post(`${this.baseUrl}${key}`, {
                msgtype: 'markdown',
                markdown: {
                    content
                }
            }).then(res => {
                console.log("work sending key = " + key + " success = " + res.data)
            }).catch(e => {
                console.log("devops sending key = " + key + " error = " + e)
            });
        })
    }

    getDesc(content) {
        if (content.status === 'stopping') {
            return `服务停止中，spanId：${content.spanId}`;
        }
        if (content.status === 'stopped') {
            return `服务已停止，spanId：${content.spanId}`;
        }
        if (content.status === 'online') {
            return `服务已恢复，spanId：${content.spanId}`;
        }
    }
}

exports.Work = Work;
