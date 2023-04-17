const moment = require('moment');
// 当前模块的ID
const hostName = require('os').hostname();
const Utils = {

    getIp() {
        let interfaces = require("os").networkInterfaces();
        for (let devName in interfaces) {
            let iface = interfaces[devName];
            for (let i = 0; i < iface.length; i++) {
                let alias = iface[i];

                if (alias.family === "IPv4" && alias.address !== "127.0.0.1" && !alias.internal) {
                    return alias.address;
                }
            }
        }
    },
    // 获取时间
    getTime(time) {
        return moment(time).format('YYYY-MM-DD HH:mm:ss');
    },
    getProcessMsg(info) {
        const msg = {};
        msg.host = hostName;
        msg.ip = this.getIp();
        msg.uptime = 0;
        msg.service = info.process.name;
        msg.pmId = info.process.pm_id;
        msg.time = this.getTime(info.at);
        msg.operator = info.event;
        msg.status = info.process.status;
        // 启动次数
        msg.restartTimes = info.process.restart_time;
        // 启动完成时间
        msg.startedTime = this.getTime(info.process.pm_uptime);
        msg.spanId = info.process.unique_id;
        if (info.process.status === 'stopped') {
            msg.uptime = info.at - info.process.pm_uptime;
        }
        return msg;
    },
    getStatusMsg(info) {
        const msg = {};
        const d = new Date();
        msg.host = hostName;
        msg.ip = this.getIp();
        msg.uptime = 0;
        msg.service = info.name;
        msg.pid = info.pid;
        msg.pmId = info.pm_id;
        msg.time = this.getTime(d.getTime())
        msg.status = info.pm2_env.status;
        // 启动次数
        msg.restartTimes = info.pm2_env.restart_time;
        // 启动完成时间
        msg.startedTime = this.getTime(info.pm2_env.pm_uptime);
        msg.uptime = d.getTime() - info.pm2_env.pm_uptime;
        // 启动完成时间
        msg.spanId = info.pm2_env.unique_id;
        msg.memory = info.monit.memory;
        msg.cpu = info.monit.cpu;
        return msg;
    },
    getLogMsg(info) {
        const msg = this.getProcessMsg(info);
        msg.msg = info.data
        return msg;
    }
}
exports.Utils = Utils