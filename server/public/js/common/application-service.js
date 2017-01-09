'use strict';

export default class ApplicationService {
    constructor(prefix, bindPoint) {
        this.prefix = prefix;
        this.bindPoint = bindPoint;
    }

    submitJsonRequest(path, onSuccess, onFailure, onCompletion) {
        $.getJSON(path).done(onSuccess).fail(onFailure).always(onCompletion);
    }

    showDialog(msg) {
        window.alert('[' + this.prefix + '] ' + msg);
    }

    createId(id) {
        return this.prefix + '-' + id;
    }

    createElement(type, id) {
        var element = document.createElement(type);
        if (id) {
            element.id = id;
        }
        return element;
    }

    appendChild(element) {
        this.bindPoint.appendChild(element);
    }

    createTimer(action, updatePeriod) {
        return new Timer(action, updatePeriod || 1000);
    }
}

export class Timer {
    constructor(action, updatePeriod) {
        this.action = action;
        this.updatePeriod = updatePeriod;
        this.intervalId = null;
    }

    isRunning() {
        return this.intervalId != null;
    }

    start() {
        if (this.intervalId || this.updatePeriod <= 0) {
            return;
        }
        this.intervalId = window.setInterval(this.action, this.updatePeriod);
    }

    stop() {
        window.clearInterval(this.intervalId);
        this.intervalId = null;
    }
}
