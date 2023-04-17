const {Devops} = require("./devops");
const {Work} = require("./work");

class Sender {
    constructor(options) {
        this.project = options.project;
        this.types = options.types.split(',');
        this.devopsTemplate = new Devops(options.devops, options);
        this.workTemplate = new Work(options.work, options);
    }

    sendEvent(content) {
        content.projectCode = this.project.code;
        content.projectName = this.project.name;
        this.types.forEach((item) => {
            switch (item) {
                case 'devops':
                    this.devopsTemplate.sendEvent(content);
                    break;
                case 'work':
                    this.workTemplate.sendEvent(content);
                    break;
            }
        });
    }

    sendStatus(content) {
        content.projectCode = this.project.code;
        content.projectName = this.project.name;
        this.types.forEach((item) => {
            switch (item) {
                case 'devops':
                    this.devopsTemplate.sendStatus(content);
                    break;
            }
        });
    }
}

exports.Sender = Sender