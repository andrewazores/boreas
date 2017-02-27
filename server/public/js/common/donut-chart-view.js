'use strict';

import c3 from 'c3';
import View from './view.js';

export default class DonutChartView extends View {
    init(keys, mouseover, mouseout) {
        if (this.chart) {
            this.chart.destroy();
        }
        this.chart = c3.generate({
            bindto: this.bindPoint,
            data: {
                rows: [keys],
                type: 'donut',
                onmousoever: mouseover,
                onmouseout: mouseout
            },
            donut: {
                title: this.title ? this.title : this.appSvc.prefix
            },
            padding: {
                top: 20,
                right: 50,
                left: 50
            },
            transition: {
                duration: this.animationDuration ? this.animationDuration : 0
            }
        });
    }

    destroy() {
        if (this.chart) {
            this.chart.destroy();
        }
    }

    setData(data) {
        this.chart.load({
            rows: data
        });
    }
}
