'use strict';

export default class BasicChartController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.view.setPlaceholder();
        this.enabled = true;
        this.updatePeriod = 1000;
        this.intervalId = null;

        this.model.initKeys(keys => {
            this.view.init(keys,
                    (d, i) => { this.enabled = false; },
                    (d, i) => { this.enabled = true; }
                );
        });
    }

    stop() {
        if (this.intervalId) {
            window.clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    start() {
        if (this.intervalId) {
            stop();
        }
        if (this.updatePeriod <= 0) {
            return;
        }
        this.intervalId = window.setInterval(() => { this.update(); }, this.updatePeriod);
    }

    setUpdatePeriod(period) {
        this.updatePeriod = period;
    }

    update() {
        this.model.update((keys, data) => {
            if (!this.enabled) {
                return;
            }
            this.view.setData([keys].concat(data));
        });
    }

    setMaxAge(maxAge) {
        this.model.maxAge = maxAge;
        this.model.trim();
        this.view.setData([this.model.keys].concat(this.model.data));
    }
}
