"use strict";

class CpuStatsModel {
    constructor() {
        this.data = [];
        this.keys = ['date'];
        this.maxAge = -1;
    }

    initKeys() {
        $.ajax({
            url: 'cpu-stats/latest',
            success: data => {
                var processorUsage = data.response[0].perProcessorUsage;
                for (var i = 0; i < processorUsage.length; i++) {
                    this.keys.push('core' + i);
                }
            },
            dataType: 'json',
            async: false
        });
    }

    addData(data) {
        var resp = data.response[0];
        var date = new Date(parseInt(resp.timeStamp.$numberLong));
        this.data.push([date].concat(resp.perProcessorUsage));

        while (this.data.length > 0) {
            var now = Date.now();
            var oldest = this.data[0];
            var age = (now - oldest[0]) / 1000;
            if (age > this.maxAge) {
                this.data.shift();
            } else {
                break;
            }
        }
    }

    update() {
        $.ajax({
            url: 'cpu-stats/latest',
            success: data => { this.addData(data); },
            dataType: 'json'
        });
    }
}

class CpuStatsView {
    constructor(keys, mouseover, mouseout) {
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

    setData(data) {
        this.chart.load({
            rows: data
        });
    }
}

class CpuStatsController {
    constructor() {
        this.model = new CpuStatsModel();
        this.model.initKeys();
        this.view = new CpuStatsView(this.model.keys,
                (d, i) => { this.enabled = false; },
                (d, i) => { this.enabled = true; }
            );
        this.enabled = true;
        this.updatePeriod = 1000;
        this.intervalId = null;
    }

    stop() {
        if (this.intervalId != null) {
            window.clearInterval(this.intervalId);
        }
    }

    start() {
        stop();
        var _this = this;
        this.intervalId = setInterval(() => { _this.update.call(_this); }, this.updatePeriod);
    }

    setUpdatePeriod(period) {
        this.stop();
        this.updatePeriod = period;
        this.start();
    }

    update() {
        this.model.update();
        if (!this.enabled) {
            return;
        }
        this.view.setData([this.model.keys].concat(this.model.data));
    }

    setMaxAge(maxAge) {
        this.model.maxAge = maxAge;
    }
}

var cpuStatsController = new CpuStatsController();

function setUpdatePeriod(v) {
    cpuStatsController.setUpdatePeriod(v);
}

function setDataAgeLimit(v) {
    cpuStatsController.setMaxAge(v);
}

window.addEventListener("load", function() {
    setUpdatePeriod(this.updatePeriodSelect.value);
    setDataAgeLimit(this.dataAgeLimitSelect.value);
    cpuStatsController.start.call(cpuStatsController);
});

window.addEventListener("unload",  function() {
    cpuStatsController.stop.call(cpuStatsController);
});
