'use strict';

import BasicChartController from '../common/basic-chart-controller.js';
import CpuUsageModel from './cpu-usage-model.js';
import TimeSeriesSplineView from '../common/time-series-spline-view.js';

export default class CpuUsageModule {
    constructor(bindPoint) {
        this.bindPoint = bindPoint;
    }

    onStart() {
        return () => {
            this.cpuStatsController.start.call(this.cpuStatsController);
        };
    }

    onStop() {
        return () => {
            this.cpuStatsController.stop.call(this.cpuStatsController);
        };
    }

    onInit() {
        return () => {
            this.cpuStatsController = new BasicChartController(new CpuUsageModel(), new TimeSeriesSplineView(this.bindPoint));

            var updatePeriodSelect = document.getElementById('updatePeriodSelect');
            updatePeriodSelect.addEventListener('change', () => { this.setUpdatePeriod(updatePeriodSelect.value); });

            var dataAgeLimitSelect = document.getElementById('dataAgeLimitSelect');
            dataAgeLimitSelect.addEventListener('change', () => { this.setDataAgeLimit(dataAgeLimitSelect.value); });

            var updatePeriodSelect = document.getElementById('updatePeriodSelect');
            var dataAgeLimitSelect = document.getElementById('dataAgeLimitSelect');
            this.setDataAgeLimit(dataAgeLimitSelect.value);
            this.setUpdatePeriod(updatePeriodSelect.value);
        };
    }

    onDestroy() {
        return () => {
            this.cpuStatsController.reset.call(this.cpuStatsController);
        };
    }

    setUpdatePeriod(v) {
        this.cpuStatsController.setUpdatePeriod.call(this.cpuStatsController, v);
    }

    setDataAgeLimit(v) {
        this.cpuStatsController.setMaxAge.call(this.cpuStatsController, v);
    }
}
