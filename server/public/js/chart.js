'use strict';

import ChartController from './controller.js';

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

class CpuStatsView {
    init(keys, mouseover, mouseout) {
        if (this.chart) {
            this.chart.destroy();
        }
        this.chart = c3.generate({
            bindto: '#chart',
            data: {
                x: keys[0],
                rows: [keys],
                type: 'area-spline',
                groups: [keys],
                onmouseover: mouseover,
                onmouseout: mouseout
            },
            padding: {
                top: 20,
                right: 50,
                left: 50
            },
            legend: {
                position: 'inset'
            },
            grid: {
                y: {
                    show: true
                }
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%H:%M:%S'
                    }
                },
                y: {
                    default: [0, 100 * (keys.length - 1)],
                    max: 100 * (keys.length - 1)
                }
            },
            transition: {
                duration: 0
            }
        });
    }

    setPlaceholder() {
        this.chart = c3.generate({
            bindto: '#chart',
            data: { rows: [] },
            padding: {
                top: 20,
                right: 50,
                left: 50
            },
            grid: {
                y: { show: true }
            },
            axis: {
                y: {
                    default: [0, 100],
                    max: 100
                }
            }
        })
    }

    setData(data) {
        this.chart.load({
            rows: data
        });
    }
}

const cpuStatsController = new ChartController(new CpuStatsModel(), new CpuStatsView());

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
