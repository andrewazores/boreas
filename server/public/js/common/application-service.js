'use strict';

export default class ApplicationService {
    constructor(prefix, bindPoint) {
        this.prefix = prefix;
        this.bindPoint = bindPoint;
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
}
