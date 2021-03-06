'use strict';

import BasicModel from '../common/basic-model.js';

export default class CpuUsageModel extends BasicModel {
    constructor(appSvc) {
        super();
        this.appSvc = appSvc;
        this.keys = ['date'];
        this.maxAge = -1;
    }

    initKeys(onSuccess, onFailure) {
        this.appSvc.submitJsonRequest('cpu-stats/latest',
            data => {
                const processorUsage = data.response[0].perProcessorUsage;
                for (var i = 0; i < processorUsage.length; i++) {
                    this.keys.push('core' + i);
                }
                onSuccess(this.keys);
            },
            onFailure
        );
    }

    update(onSuccess, onFailure) {
        this.appSvc.submitJsonRequest('cpu-stats/latest',
            data => {
                const resp = data.response[0];
                const date = new Date(parseInt(resp.timeStamp.$numberLong));
                this.data.push([date].concat(resp.perProcessorUsage));

                this.trim();

                onSuccess(this.keys, this.data);
            },
            onFailure
        );
    }

    trim() {
        while (this.data.length > 0) {
            const now = Date.now();
            const oldest = this.data[0];
            const age = (now - oldest[0]) / 1000;
            if (this.maxAge > 0 && age > this.maxAge) {
                this.data.shift();
            } else {
                break;
            }
        }
    }
}
