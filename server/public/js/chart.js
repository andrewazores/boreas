'use strict';

import BasicChartController from './basic-chart-controller.js';
import TimeSeriesSplineView from './time-series-spline-view.js';

class CpuStatsModel {
    constructor() {
        this.data = [];
        this.keys = ['date'];
        this.maxAge = -1;
    }

    initKeys(callback) {
        $.getJSON('cpu-stats/latest',
            data => {
                const processorUsage = data.response[0].perProcessorUsage;
                for (var i = 0; i < processorUsage.length; i++) {
                    this.keys.push('core' + i);
                }
                callback(this.keys);
            }
        );
    }

    update(callback) {
        $.getJSON('cpu-stats/latest', data => {
            const resp = data.response[0];
            const date = new Date(parseInt(resp.timeStamp.$numberLong));
            this.data.push([date].concat(resp.perProcessorUsage));

            this.trim();

            callback(this.keys, this.data);
        });
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

const cpuStatsController = new BasicChartController(new CpuStatsModel(), new TimeSeriesSplineView());

function setUpdatePeriod(v) {
    cpuStatsController.stop.call(cpuStatsController);
    cpuStatsController.setUpdatePeriod.call(cpuStatsController, v);
    cpuStatsController.start.call(cpuStatsController);
}

var updatePeriodSelect = document.getElementById('updatePeriodSelect');
updatePeriodSelect.addEventListener('change', () => { setUpdatePeriod(updatePeriodSelect.value); });

function setDataAgeLimit(v) {
    cpuStatsController.setMaxAge.call(cpuStatsController, v);
}

var dataAgeLimitSelect = document.getElementById('dataAgeLimitSelect');
dataAgeLimitSelect.addEventListener('change', () => { setDataAgeLimit(dataAgeLimitSelect.value); });

window.addEventListener('load', function() {
    setDataAgeLimit(this.dataAgeLimitSelect.value);
    setUpdatePeriod(this.updatePeriodSelect.value);
});

window.addEventListener('unload',  function() {
    cpuStatsController.stop.call(cpuStatsController);
});
