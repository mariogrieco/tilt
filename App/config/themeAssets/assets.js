import merge from 'lodash/merge';
import lightAssets from './light';
import darkAssets from './dark';
import darkGrayAssets from './darkGray';

const assets = merge(assets, lightAssets, darkAssets, darkGrayAssets);

export default assets;
