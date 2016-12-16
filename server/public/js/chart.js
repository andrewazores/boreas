var cpuStatsModelPrototype = {
    _data: [],
    _keys: [],

    init: function() {
        _this = this;
        $.ajax({
            url: 'cpu-stats/latest',
            success: data => { _this.initData(data); },
            dataType: 'json',
            async: false
        });
    },

    initData: function(data) {
        var processorUsage = data.response[0].perProcessorUsage;
        for (i = 0; i < processorUsage.length; i++) {
            this._keys.push('core' + i);
        }
    },

    addData: function(data) {
        this._data.push(data.response[0].perProcessorUsage);
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

    init: function(keys) {
        var datatypes = [];
        for (i = 0; i < keys.length; i++) {
            datatypes[keys[i]] = 'area-spline';
        }
        this.chart = c3.generate({
            bindto: '#chart',
            data: {
                rows: [keys],
                types: datatypes,
                groups: [keys]
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

    init: function() {
        this._model.init();
        this._view.init(this._model._keys);
    },

    update: function() {
        this._model.update();
        var len = this._model._data.length - this._limit;
        if (len < 0) {
            len = 0;
        }
        var update = this._model._data.slice(len);
        update.unshift(this._model._keys);
        this._view.setData(update);
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
