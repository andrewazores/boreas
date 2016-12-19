var cpuStatsModelPrototype = {
    _data: [],
    _keys: ['date'],
    _limit: -1,

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
        if (this._limit > 0 && this._data.length > this._limit) {
            this._data.shift();
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
    _limit: 0,
    _enabled: true,

    init: function() {
        this._model.init(this._limit);
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

cpuStatsController.init();
cpuStatsController._limit = 30;
setInterval(function() {
    cpuStatsController.update();
}, 1000);
