import { Platform } from 'react-native';

const developId = 'ca-app-pub-3940256099942544/6300978111';

const production = Platform.OS === 'android'
  ? {
    chart: 'ca-app-pub-8980571709710614/2352184685',
    history: 'ca-app-pub-8980571709710614/7848053949',
    book: 'ca-app-pub-8980571709710614/1226805271',
    stat: 'ca-app-pub-8980571709710614/6099858009',
    sponsor: 'ca-app-pub-8980571709710614/3137924762'
  }
  : {
    chart: 'ca-app-pub-8980571709710614/4048409738',
    history: 'ca-app-pub-8980571709710614/4100380620',
    book: 'ca-app-pub-8980571709710614/6726543966',
    stat: 'ca-app-pub-8980571709710614/2877716720',
    sponsor: 'ca-app-pub-8980571709710614/3137924762'
  };

const develop = {
  chart: developId,
  history: developId,
  book: developId,
  stat: developId,
  sponsor: developId
};

export default process.env.NODE_ENV === 'development' ? develop : production;
