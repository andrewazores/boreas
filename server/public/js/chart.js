var c1Data = ['core1'];

var sliding = 0;
var clength = 100;

var chart = c3.generate({
  bindto: '#chart',
  data: {
    columns: [
      c1Data
    ],
    types: {
      core1: 'area'
    }
  }
});

var updateData = data => {
  c1Data.push(data.response[0].perProcessorUsage[0]);
  if (!sliding) {
    chart.load({
      columns : [
        c1Data
      ]
    });
    if (c1Data.length > clength) {
      sliding = 1;
    }
  }  else {
    chart.flow({
      columns : [
        ['core1', c1Data[c1Data.length-1]]
      ]
    });
  }

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
