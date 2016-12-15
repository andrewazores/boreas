var cpuStatsModelPrototype = {
    _data: [],

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
        var row = [];
        for (i = 0; i < processorUsage.length; i++) {
            row[i] = ['core' + i];
        }
        this._data.push(row);
    },

    setData: function(data) {
        this._data.push(data.response[0].perProcessorUsage);
    },

    update: function() {
        _this = this;
        $.ajax({
            url: 'cpu-stats/latest',
            success: data => { _this.setData(data); },
            dataType: 'json',
        });
    }
}

var cpuStatsViewPrototype = {
    chart: null,

    init: function() {
        this.chart = c3.generate({
            bindto: '#chart',
            data: {
                rows: [[]],
            },
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

    init: function() {
        this._model.init();
        this._view.init();
    },

    update: function() {
        this._model.update();
        this._view.setData(this._model._data);
    },
}

var cpuStatsController = Object.create(cpuStatsControllerPrototype);
cpuStatsController._view = Object.create(cpuStatsViewPrototype);
cpuStatsController._model = Object.create(cpuStatsModelPrototype);

cpuStatsController.init();
setInterval(function() {
    cpuStatsController.update();
}, 1000);
