var cpuStatsModelPrototype = {
    _data: [ 'core1' ],

    init: function(){}

e   setData: function(data) {
        this._data.push(data.response[0].perProcessorUsage[0]);
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
                columns: [[]],
                types: {
                    core1: 'area'
                }
            },
        });
    },

    setData: function(data) {
        this.chart.load({
            columns: [data]
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
