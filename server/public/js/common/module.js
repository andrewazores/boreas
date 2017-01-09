'use strict';

const emptyFunc = () => {};

export default class Module {
    constructor(appSvc) {
        this.appSvc = appSvc;
    }

    onInit() {
        return emptyFunc;
    }

    onStart() {
        return emptyFunc;
    }

    onStop() {
        return emptyFunc;
    }

    onDestroy() {
        return emptyFunc;
    }
}
