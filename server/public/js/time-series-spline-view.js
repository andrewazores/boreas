export default class TimeSeriesSplineView {
    init(keys, mouseover, mouseout) {
        if (this.chart) {
            this.chart.destroy();
        }
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
    }

    setPlaceholder() {
        this.chart = c3.generate({
            bindto: '#chart',
            data: { rows: [] },
            padding: {
                top: 20,
                right: 50,
                left: 50
            },
            grid: {
                y: { show: true }
            },
            axis: {
                y: {
                    default: [0, 100],
                    max: 100
                }
            }
        })
    }

    setData(data) {
        this.chart.load({
            rows: data
        });
    }
}
