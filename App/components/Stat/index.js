import React from 'react';
import {View, ScrollView, Text, Image} from 'react-native';
import {connect} from 'react-redux';
import {StatsBanner} from '../AdBanner';
import Separator from '../Separator';
import Circle from '../Circle';
import styles from './styles';

// const ARROW_UP = require('../../../assets/themes/light/arrow_up/shape.png');
// const ARROW_DOWN = require('../../../assets/themes/light/arrow_down/shape.png');

const Section = ({tag, price, theme}) => (
  <View style={styles.container}>
    <View style={[styles.row, {paddingTop: 11, paddingBottom: 12}]}>
      <Text
        style={[
          styles.tag,
          {color: theme.primaryTextColor},
          {flex: 1, textAlign: 'left', letterSpacing: 0.1},
        ]}>
        {`${tag}`}
      </Text>
      <Text
        style={[
          styles.number,
          {color: theme.primaryTextColor},
        ]}>{`${price}`}</Text>
    </View>
  </View>
);

const MemoSection = React.memo(Section);

const Stat = ({
  selectedSymbol: {
    bidPrice,
    askPrice,
    highPrice,
    lowPrice,
    volume,
    prevClosePrice,
    lastPrice,
    lastQty,
  },
  theme,
}) => (
  <ScrollView>
    <View style={[styles.header, styles.container]}>
      <View>
        <View style={[styles.row, {justifyContent: 'flex-start'}]}>
          <Circle styles={{backgroundColor: '#57cb92', marginRight: 10}} />
          <Text style={[styles.tag, {color: theme.primaryTextColor}]}>Bid</Text>
        </View>
        <Text
          style={[
            styles.number,
            {color: theme.primaryTextColor},
            {marginTop: 13},
          ]}>
          {`${parseFloat(bidPrice)}`}
        </Text>
      </View>
      <View>
        <View style={[styles.row, {justifyContent: 'flex-end'}]}>
          <Text style={[styles.tag, {color: theme.primaryTextColor}]}>Ask</Text>
          <Circle styles={{backgroundColor: '#FC3E30', marginLeft: 10}} />
        </View>
        <Text
          style={[
            styles.number,
            {color: theme.primaryTextColor},
            {marginTop: 13},
          ]}>
          {`${parseFloat(askPrice)}`}
        </Text>
      </View>
    </View>
    <Separator />
    <MemoSection theme={theme} tag="Last Price" price={parseFloat(lastPrice)} />
    <Separator />
    <MemoSection
      theme={theme}
      tag="Last Quantity"
      price={parseFloat(lastQty)}
    />
    <Separator />
    <MemoSection theme={theme} tag="24H Volume" price={parseFloat(volume)} />
    <Separator />
    <MemoSection
      theme={theme}
      tag="Previous Close"
      price={parseFloat(prevClosePrice)}
    />
    <Separator />
    <View
      style={[styles.row, styles.container, {justifyContent: 'space-between'}]}>
      <View style={styles.row}>
        <Text
          style={[
            styles.tag,
            {color: theme.primaryTextColor},
            {marginRight: 3},
          ]}>
          24H High
        </Text>
        {/* <Image source={ARROW_UP} /> */}
      </View>
      <Text style={styles.highNumber}>{`${parseFloat(highPrice)}`}</Text>
      <View style={[styles.row, {paddingTop: 11, paddingBottom: 12}]}>
        <Text
          style={[
            styles.tag,
            {color: theme.primaryTextColor},
            {marginRight: 3},
          ]}>
          24H Low
        </Text>
        {/* <Image source={ARROW_DOWN} /> */}
      </View>
      <Text style={styles.lowNumber}>{`${parseFloat(lowPrice)}`}</Text>
    </View>
    <View style={{flexDirection: 'row'}}>
      <View style={{flex: 1}}>
        <Separator />
      </View>
      <View style={{flex: 0.2}} />
      <View style={{flex: 1}}>
        <Separator />
      </View>
    </View>
    <View style={{alignItems: 'center', paddingTop: 40}}>
      <StatsBanner />
    </View>
  </ScrollView>
);

const mapStateToProps = ({watchlist: {selectedSymbol}, themes}) => ({
  selectedSymbol,
  theme: themes[themes.current],
});

export default connect(mapStateToProps)(Stat);
