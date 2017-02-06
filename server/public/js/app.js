'use strict';

import ApplicationService from './common/application-service.js';
import CpuUsageModule from './cpu-usage/cpu-usage-module.js';
import MemoryUsageModule from './memory-usage/memory-usage-module.js';

const modules = [];
const bindPoints = [];

const rootAppSvc = new ApplicationService("ThermostatWeb", document.body);

const cpuUsageDiv = rootAppSvc.createElement('div', 'cpuUsageDiv');
bindPoints.push(cpuUsageDiv);

const cpuUsageModule = new CpuUsageModule(new ApplicationService('CpuUsage', cpuUsageDiv));
modules.push(cpuUsageModule);

const memoryUsageDiv = rootAppSvc.createElement('div', 'memoryUsageDiv');
bindPoints.push(memoryUsageDiv);

const memoryUsageModule = new MemoryUsageModule(new ApplicationService('MemoryUsage', memoryUsageDiv));
modules.push(memoryUsageModule);

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
