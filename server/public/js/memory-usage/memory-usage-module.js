'use strict';

import Module from '../common/module.js';
import BasicChartController from '../common/basic-chart-controller.js';
import MemoryUsageModel from './memory-usage-model.js';
import DonutChartView from '../common/donut-chart-view.js';

export default class MemoryUsageModule extends Module {
    constructor(appSvc) {
        super(appSvc);
    }

    onStart() {
        return () => {
            this.memoryStatsController.start.call(this.memoryStatsController);
        };
    }

    onStop() {
        return () => {
            this.memoryStatsController.stop.call(this.memoryStatsController);
        };
    }

    onInit() {
        return () => {
            var chartDiv = this.appSvc.createElement('div', 'chart');
            this.appSvc.appendChild(chartDiv);

            this.chart = new DonutChartView(this.appSvc, chartDiv);
            this.chart.title = 'Host Memory Usage';
            this.chart.animationDuration = 500;
            this.memoryStatsController = new BasicChartController(this.appSvc, new MemoryUsageModel(this.appSvc), this.chart);

            var createOption = (label, value, selected) => {
                var opt = this.appSvc.createElement('option');
                opt.value = value;
                opt.innerHTML = label;
                if (selected) {
                    opt.selected = true;
                }
                return opt;
            }

            var createSelectForm = (id, labelText) => {
                var form = this.appSvc.createElement('form');
                var label = this.appSvc.createElement('label');
                var select = this.appSvc.createElement('select');

                select.id = id;
                select.name = id;

                label.innerHTML = labelText;
                label.for = id;

                form.appendChild(label);
                form.appendChild(select);

                return { form: form, select: select, appendChild: c => select.appendChild(c) };
            };

            var updatePeriod = createSelectForm(this.appSvc.createId('updatePeriodSelect'), 'Update Period');
            updatePeriod.appendChild(createOption('Disabled', -1));
            updatePeriod.appendChild(createOption('1 Second', 1000));
            updatePeriod.appendChild(createOption('5 Seconds', 5000, true));
            updatePeriod.appendChild(createOption('10 Seconds', 10000));
            updatePeriod.appendChild(createOption('1 Minute', 60000));
            this.appSvc.appendChild(updatePeriod.form);

            updatePeriod.select.addEventListener('change', v => { this.setUpdatePeriod(v.currentTarget.value); });

            this.memoryStatsController.setUpdatePeriod.call(this.memoryStatsController, updatePeriod.select.value);
        };
    }

    onDestroy() {
        return () => {
            this.memoryStatsController.reset.call(this.memoryStatsController);
        };
    }

    setUpdatePeriod(v) {
        this.memoryStatsController.stop.call(this.memoryStatsController);
        this.memoryStatsController.setUpdatePeriod.call(this.memoryStatsController, v);
        this.memoryStatsController.start.call(this.memoryStatsController);
    }
}
