var chart;
var core1Stats = ['core1'];
var createChart = data => {
  console.log(data);
  core1Stats.push(data.perProcessorUsage[0]);
  chart = c3.generate({
    bindto: '#chart',
    data: {
      columns: [
        core1Stats
      ],
      types: {
        core1: 'area'
      }
    }
  });
};

(function poll() {
  setTimeout(function() {
    $.ajax({
      url: 'storage/cpu-stats',
      success: createChart,
      dataType: "json",
      complete: poll
    });
  }, 1000);
})();
