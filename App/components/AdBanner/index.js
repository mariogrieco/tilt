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

export class StatBanner extends React.PureComponent {
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

export class SponsorBanner extends React.PureComponent {
  render() {
    return (
      <View style={{height: 250, width: 300}}>
        <Banner
          size="MEDIUM_RECTANGLE"
          unitId={adMob.sponsor}
          request={request.build()}
          // onAdLoaded={() => {
          // console.log('Advert loaded');
          // }}
        />
      </View>
    );
  }
}
