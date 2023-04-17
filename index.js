const pm2 = require('pm2')
const pmx = require('pmx')
const {Utils} = require("./utils/utils");
const {Sender} = require("./utils/sender");
pmx.initModule(
    // 配置
    {},
    // 函数
    function (err, options) {
        // 设置默认参数
        options.throttleTime = options.throttleTime || 5000;
        // 需要发送的类型
        options.types = options.types || 'devops';
        // 项目标识
        options.project = options.project || {};
        options.project.code = options.project.code || '';
        options.project.name = options.project.name || '测试项目';
        //开发平台
        options.devops = options.devops || {};
        options.devops.key = options.devops.key || '';
        options.devops.domain = options.devops.domain || 'http://192.168.8.148:8031';
        options.devops.upload = options.devops.upload || '/openapi/pm2-events';
        options.devops.query = options.devops.query || '/pm2-events/';
        options.devops.status = options.devops.status || '/openapi/pm2-status';

        // 企业微信
        options.work = options.work || {};
        options.work.keys = options.work.keys || '';

        if (err) {
            throw err;
        }
        const SenderTemplate = new Sender(options);
        pm2.launchBus(function (err, bus) {
            if (err) throw err;
            bus.on('process:*', function (type, info) {
                if (info.process.name === options.module_name) return;
                console.log(info);
                const processMsg = Utils.getProcessMsg(info);
                console.log(JSON.stringify(processMsg))
                SenderTemplate.sendEvent(processMsg)

            })
            bus.on('log:*', function (type, info) {
                if (info.process.name === options.module_name) return;
                if (type !== 'error') return;
                const errorMsg = Utils.getLogMsg(info);
                console.log(JSON.stringify(errorMsg))
                SenderTemplate.sendEvent(errorMsg)
            })
        });

        setInterval(function () {
            pm2.list(
                (err, list) => {
                    if (err) throw err;
                    for (let item of list) {
                        if (item.name !== options.module_name) {
                            const processMsg = Utils.getStatusMsg(item);
                            SenderTemplate.sendStatus(processMsg)
                        }
                    }
                }
            );
        }, 1000 * 30);
    })