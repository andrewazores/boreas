'use strict';

export default class BasicModel {
    constructor() {
        this.data = [];
        this.keys = [];
    }

    initKeys(callback) {}

    update(callback) {}

    clearData() {
        this.data = [];
    }

    clearKeys() {
        this.keys = [];
    }
}
