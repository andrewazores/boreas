'use strict';

import CpuUsageModule from './cpu-usage/cpu-usage-module.js';

const modules = [];

const cpuUsageDiv = document.createElement('div');
cpuUsageDiv.id = 'cpuUsageDiv';
const cpuUsageModule = new CpuUsageModule(cpuUsageDiv);
modules.push(cpuUsageModule);

document.body.appendChild(cpuUsageDiv);

window.addEventListener('load', () => {
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
