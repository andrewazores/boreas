'use strict';

const emptyFunc = () => {};

export default class Module {
    constructor(bindPoint) {
        this.bindPoint = bindPoint;
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
