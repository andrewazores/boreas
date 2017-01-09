'use strict';

export default class View {
    constructor(appSvc, bindPoint) {
        this.appSvc = appSvc;
        this.bindPoint = bindPoint;
    }

    showDialog(msg) {
        this.appSvc.showDialog(msg);
    }

    destroy() {}
}
