'use strict';

import BasicModel from '../common/basic-model.js';

export default class MemoryUsageModel extends BasicModel {
    constructor(appSvc) {
        super();
        this.appSvc = appSvc;
        this.keys = ['free', 'buffers', 'cached'];
        this.data = [];
    }

    initKeys(onSuccess, onFailure) {
        onSuccess(this.keys);
    }

    update(onSuccess, onFailure) {
        this.appSvc.submitJsonRequest('memory-stats/latest',
            data => {
                const resp = data.response[0];

                const free = parseInt(resp.free.$numberLong);
                const buffers = parseInt(resp.buffers.$numberLong);
                const cached = parseInt(resp.cached.$numberLong);

                this.data = [[free, buffers, cached]];

                onSuccess(this.keys, this.data);
            },
            onFailure
        );
    }

}
