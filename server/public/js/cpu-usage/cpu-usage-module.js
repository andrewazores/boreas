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
            var chartDiv = document.createElement('div');
            chartDiv.id = this.bindPoint + '-chart';
            this.bindPoint.appendChild(chartDiv);
            this.cpuStatsController = new BasicChartController(new CpuUsageModel(), new TimeSeriesSplineView(chartDiv));

            var createOption = (label, value, selected) => {
                var opt = document.createElement('option');
                opt.value = value;
                opt.innerHTML = label;
                if (selected) {
                    opt.selected = true;
                }
                return opt;
            }

            var updatePeriodForm = document.createElement('form');
            var updatePeriodLabel = document.createElement('label');
            var updatePeriodSelect = document.createElement('select');

            updatePeriodSelect.id = this.bindPoint + '-updatePeriodSelect';
            updatePeriodSelect.name = updatePeriodSelect.id;

            updatePeriodLabel.innerHTML = 'Update Period';
            updatePeriodLabel.for = updatePeriodSelect.id;

            updatePeriodForm.appendChild(updatePeriodLabel);
            updatePeriodForm.appendChild(updatePeriodSelect);
            updatePeriodSelect.appendChild(createOption('Disabled', -1));
            updatePeriodSelect.appendChild(createOption('1 Second', 1000, true));
            updatePeriodSelect.appendChild(createOption('2 Seconds', 2000));
            updatePeriodSelect.appendChild(createOption('5 Seconds', 5000));
            this.bindPoint.appendChild(updatePeriodForm);

            var dataAgeForm = document.createElement('form');
            var dataAgeLabel = document.createElement('label');
            var dataAgeSelect = document.createElement('select');

            dataAgeSelect.id = this.bindPoint + '-dataAgeSelect';
            dataAgeSelect.name = dataAgeSelect.id;

            dataAgeLabel.innerHTML = 'Data Age Limit';
            dataAgeLabel.for = dataAgeSelect.id;

            dataAgeForm.appendChild(dataAgeLabel);
            dataAgeForm.appendChild(dataAgeSelect);
            dataAgeSelect.appendChild(createOption('None', -1));
            dataAgeSelect.appendChild(createOption('10 Seconds', 10, true));
            dataAgeSelect.appendChild(createOption('30 Seconds', 30));
            dataAgeSelect.appendChild(createOption('1 Minute', 60));
            dataAgeSelect.appendChild(createOption('5 Minutes'), 300);
            dataAgeSelect.appendChild(createOption('10 Minutes', 600));
            dataAgeSelect.appendChild(createOption('30 Minutes', 1800));
            dataAgeSelect.appendChild(createOption('1 Hour', 3600));
            this.bindPoint.appendChild(dataAgeForm);

            updatePeriodSelect.addEventListener('change', v => { this.setUpdatePeriod(v.currentTarget.value); });

            dataAgeSelect.addEventListener('change', v => { this.setDataAgeLimit(v.currentTarget.value); });

            this.cpuStatsController.setUpdatePeriod.call(this.cpuStatsController, updatePeriodSelect.value);
            this.cpuStatsController.setMaxAge.call(this.cpuStatsController, dataAgeSelect.value);
        };
    }

    onDestroy() {
        return () => {
            this.cpuStatsController.reset.call(this.cpuStatsController);
        };
    }

    setUpdatePeriod(v) {
        this.cpuStatsController.stop.call(this.cpuStatsController);
        this.cpuStatsController.setUpdatePeriod.call(this.cpuStatsController, v);
        this.cpuStatsController.start.call(this.cpuStatsController);
    }

    setDataAgeLimit(v) {
        this.cpuStatsController.setMaxAge.call(this.cpuStatsController, v);
    }
}
