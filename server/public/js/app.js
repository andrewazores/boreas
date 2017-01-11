'use strict';

import ApplicationService from './common/application-service.js';
import CpuUsageModule from './cpu-usage/cpu-usage-module.js';

const modules = [];
const bindPoints = [];

const rootAppSvc = new ApplicationService("ThermostatWeb", document.body);

const cpuUsageDiv = rootAppSvc.createElement('div', 'cpuUsageDiv');
bindPoints.push(cpuUsageDiv);

const cpuUsageModule = new CpuUsageModule(new ApplicationService('CpuUsage', cpuUsageDiv));
modules.push(cpuUsageModule);

window.addEventListener('load', () => {
    bindPoints.forEach(bindPoint => {
        rootAppSvc.appendChild(bindPoint);
    });

    modules.forEach(module => {
        module.onInit().call(module);
    });

    modules.forEach(module => {
        module.onStart().call(module);
    });
});

window.addEventListener('unload', () => {
    modules.forEach(module => {
        module.onStop().call(module);
    });

    modules.forEach(module => {
        module.onDestroy().call(module);
    });
});
