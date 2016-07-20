var core1Stats = ['core1'];
var chart = c3.generate({
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

var updateData = data => {
  console.log(data);
  core1Stats.push(data.response[0].perProcessorUsage[0]);
  chart.load ({
    columns: [
      core1Stats
    ]
  });
};

(function poll() {
  setTimeout(function() {
    $.ajax({
      url: 'cpu-stats/latest',
      success: updateData,
      dataType: "json",
      complete: poll
    });
  }, 1000);
})();
