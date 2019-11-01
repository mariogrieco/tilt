import React from 'react';
import {View} from 'react-native';
import firebase from 'react-native-firebase';
import adMob from '../../config/adMob';

const {Banner} = firebase.admob;
const {AdRequest} = firebase.admob;
const request = new AdRequest();

export class ChartBanner extends React.PureComponent {
  render() {
    return (
      <Banner
        size="BANNER"
        unitId={adMob.chart}
        request={request.build()}
        onAdLoaded={() => {
          // console.log('Advert loaded');
        }}
      />
    );
  }
}

export class BookBanner extends React.PureComponent {
  render() {
    return (
      <Banner
        size="BANNER"
        unitId={adMob.book}
        request={request.build()}
        onAdLoaded={() => {
          // console.log('Advert loaded');
        }}
      />
    );
  }
}

export class HistoryBanner extends React.PureComponent {
  render() {
    return (
      <Banner
        size="BANNER"
        unitId={adMob.history}
        request={request.build()}
        onAdLoaded={() => {
          // console.log('Advert loaded');
        }}
      />
    );
  }
}

export class StatsBanner extends React.PureComponent {
  render() {
    return (
      <Banner
        size="MEDIUM_RECTANGLE"
        unitId={adMob.stat}
        request={request.build()}
        onAdLoaded={() => {
          // console.log('Advert loaded');
        }}
      />
    );
  }
}

export class SponsoredBanner extends React.PureComponent {
  render() {
    const {isRepost} = this.props;
    return (
      // eslint-disable-next-line react-native/no-inline-styles
      <View style={{height: 250, width: 300}}>
        <Banner
          size={isRepost ? '270x225' : 'MEDIUM_RECTANGLE'}
          unitId={adMob.sponsor}
          request={request.build()}
        />
      </View>
    );
  }
}
