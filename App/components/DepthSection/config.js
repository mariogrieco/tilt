import {processColor} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';

// if you want style the lines of the chart,
// change the values inside the getDerivedStateFromPropsMethod

const config = {
  xAxis: {
    drawLabels: true,
    drawGridLines: true,
    gridLineWidth: StyleSheet.hairlineWidth,
    gridColor: processColor('#DCDCDC'),
    position: 'TOP',
    yOffset: 1,
    drawAxisLine: true,
    axisLineColor: processColor('#DCDCDC'),
    axisLineWidth: StyleSheet.hairlineWidth,
    labelCount: 5,
    avoidFirstLastClipping: true,
    fontFamily: 'SFProDisplay-Regular',
    textSize: 11,
    textColor: processColor('#0e141e'),
  },
  yAxis: {
    spaceBottom: 0,
    drawGridLines: false,
    zeroLine: {
      enabled: true,
      lineWidth: StyleSheet.hairlineWidth,
      lineColor: processColor('#DCDCDC'),
    },
    left: {
      enabled: true,
      drawAxisLine: true,
      axisLineColor: processColor('#DCDCDC'),
      axisLineWidth: StyleSheet.hairlineWidth,
      avoidFirstLastClipping: true,
      gridLineWidth: StyleSheet.hairlineWidth,
      gridColor: processColor('#DCDCDC'),
      labelCount: 5,
      textSize: 11,
      fontFamily: 'SFProDisplay-Regular',
      textColor: processColor('#0e141e'),
      position: 'INSIDE_CHART',
    },
    right: {
      enabled: true,
      drawAxisLine: true,
      axisLineColor: processColor('#DCDCDC'),
      axisLineWidth: StyleSheet.hairlineWidth,
      avoidFirstLastClipping: true,
      gridLineWidth: StyleSheet.hairlineWidth,
      gridColor: processColor('#DCDCDC'),
      labelCount: 5,
      textSize: 11,
      fontFamily: 'SFProDisplay-Regular',
      textColor: processColor('#0e141e'),
      position: 'INSIDE_CHART',
    },
  },
  marker: {
    enabled: false,
  },
  data: {
    dataSets: [
      {
        values: [0],
        label: '',
        config: {
          drawValues: false,
          colors: [processColor('green')],
          drawCircles: false,
          lineWidth: 2,
        },
      },
      {
        values: [0],
        label: '',
        config: {
          drawValues: false,
          colors: [processColor('blue')],
          drawCircles: false,
          lineWidth: 2,
        },
      },
    ],
  },
};

export default config;
