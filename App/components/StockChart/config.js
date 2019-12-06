import {processColor} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';

const config = {
  data: {
    dataSets: [
      {
        values: [
          {
            shadowH: 0,
            shadowL: 0,
            close: 0,
            open: 0,
          },
        ],
        label: '',
        config: {
          highlightColor: processColor('darkgray'),
          shadowColor: processColor('#8E8E95'),
          shadowWidth: 1,
          shadowColorSameAsCandle: true,
          increasingColor: processColor('#71BD6A'),
          increasingPaintStyle: 'FILL',
          decreasingColor: processColor('#FC3E30'),
          drawValues: false,
        },
      },
    ],
  },
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
    drawGridLines: false,
    spaceBottom: 0,
    left: {
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
      drawLabels: false,
      drawGridLines: false,
    },
  },
  marker: {
    enabled: false,
    markerColor: processColor('#2c3e50'),
    textColor: processColor('white'),
  },
  legend: {
    enabled: false,
    textSize: 14,
    form: 'CIRCLE',
    wordWrapEnabled: true,
  },
};
export default config;
