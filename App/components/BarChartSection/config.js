import { processColor } from 'react-native';

const config = {
  description: {
    text: ''
  },
  legend: {
    enabled: false,
  },
  data: {
    dataSets: [{
      values: [{ y: 0 }],
      label: 'Bar dataSet',
      config: {
        colors: [processColor('#17C491')],
        // barShadowColor: processColor('lightgrey'),
        // highlightAlpha: 90,
        // highlightColor: processColor('red'),
        drawValues: false
      }
    }],

    config: {
      barWidth: 0.8,
    }
  },
  // highlights: [{ x: 3 }, { x: 6 }],
  xAxis: {
    // valueFormatter: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    granularityEnabled: false,
    granularity: 1,
    drawGridLines: false,
    drawLabels: false,
    drawAxisLine: false,
    fontSize: 0,
    yOffset: 0
  },
  yAxis: {
    left: {
      enabled: false,
      spaceTop: 0,
      spaceBottom: 0
    },
    right: {
      enabled: false,
      spaceTop: 0,
      spaceBottom: 0
    }
  }
};

export default config;
