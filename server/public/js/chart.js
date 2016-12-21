var cpuStatsModelPrototype = {
    _data: [],
    _keys: ['date'],
    _maxAge: -1,

    init: function(limit) {
        this._limit = limit;
        _this = this;
        $.ajax({
            url: 'cpu-stats/latest',
            success: data => { _this.initKeys(data); },
            dataType: 'json',
            async: false
        });
    },

    initKeys: function(data) {
        var processorUsage = data.response[0].perProcessorUsage;
        for (i = 0; i < processorUsage.length; i++) {
            this._keys.push('core' + i);
        }
    },

    addData: function(data) {
        var resp = data.response[0];
        var date = new Date(new Number(resp.timeStamp.$numberLong));
        this._data.push([date].concat(resp.perProcessorUsage));

        while (this._data.length > 0) {
            var now = Date.now();
            var oldest = this._data[0];
            var age = (now - oldest[0]) / 1000;
            if (age > this._maxAge) {
                this._data.shift();
            } else {
                break;
            }
        }
    },

    update: function() {
        _this = this;
        $.ajax({
            url: 'cpu-stats/latest',
            success: data => { _this.addData(data); },
            dataType: 'json'
        });
    }
}

var cpuStatsViewPrototype = {
    chart: null,

    init: function(keys, mouseover, mouseout) {
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
    },

    setData: function(data) {
        this.chart.load({
            rows: data
        });
    }
}

var cpuStatsControllerPrototype = {
    _model: null,
    _view: null,
    _enabled: true,

    init: function() {
        this._model.init();
        this._view.init(this._model._keys,
                (d, i) => { this._enabled = false; },
                (d, i) => { this._enabled = true; }
            );
    },

    update: function() {
        this._model.update();
        if (!this._enabled) {
            return;
        }
        this._view.setData([this._model._keys].concat(this._model._data));
    }
}

var cpuStatsController = Object.create(cpuStatsControllerPrototype);
cpuStatsController._view = Object.create(cpuStatsViewPrototype);
cpuStatsController._model = Object.create(cpuStatsModelPrototype);

var intervalId = null;
function setUpdatePeriod(v) {
    clearInterval(intervalId);
    intervalId = setInterval(function() {
        cpuStatsController.update();
    }, v);
}

function setDataAgeLimit(v) {
    cpuStatsController._model._maxAge = v;
}

window.onload = function() {
    cpuStatsController.init();
    setUpdatePeriod(this.updatePeriodSelect.value);
    setDataAgeLimit(this.dataAgeLimitSelect.value);
};
