import moment from 'moment';

const intervals = [
  {
    startTimeTag: '1H',
    interval: '1m',
    starTimeMilliseconds: () => moment().subtract(1, 'hours').utc().valueOf(),
    format: 'H:mm'
  },
  {
    startTimeTag: '12H',
    interval: '15m',
    starTimeMilliseconds: () => moment().subtract(12, 'hours').utc().valueOf(),
    format: 'H:mm'
  },
  {
    startTimeTag: '1D',
    interval: '30m',
    starTimeMilliseconds: () => moment().subtract(1, 'days').utc().valueOf(),
    format: 'H:mm'
  },
  {
    startTimeTag: '1W',
    interval: '4h',
    starTimeMilliseconds: () => moment().subtract(7, 'days').utc().valueOf(),
    format: 'MMM D'
  },
  {
    startTimeTag: '1M',
    interval: '12h',
    starTimeMilliseconds: () => moment().subtract(30, 'days').utc().valueOf(),
    format: 'MMM D'
  },
  {
    startTimeTag: '6M',
    interval: '3d',
    starTimeMilliseconds: () => moment().subtract(180, 'days').utc().valueOf(),
    format: 'MMM D'
  },
  {
    startTimeTag: '1Y',
    interval: '1w',
    starTimeMilliseconds: () => moment().subtract(365, 'days').utc().valueOf(),
    format: 'MMM, YY'
  },
];

export default intervals;
