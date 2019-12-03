import Client4 from '../api/MattermostClient';
import {PER_PAGE_DEFAULT} from '../api/globals';
import {getChannelsSucess} from './channels';
import moment from 'moment';

export const ALL_CHANNELS_TAB_PAGINATOR_SUCCESS =
  'ALL_CHANNELS_TAB_PAGINATOR_SUCCESS';
export const ALL_CHANNELS_TAB_PAGINATOR_ERROR =
  'ALL_CHANNELS_TAB_PAGINATOR_ERROR';

export const NEW_CHANNELS_TAB_PAGINATOR_SUCCESS =
  'NEW_CHANNELS_TAB_PAGINATOR_SUCCESS';
export const NEW_CHANNELS_TAB_PAGINATOR_ERROR =
  'NEW_CHANNELS_TAB_PAGINATOR_ERROR';

export const STOCKS_CHANNELS_TAB_PAGINATOR_SUCCESS =
  'STOCKS_CHANNELS_TAB_PAGINATOR_SUCCESS';
export const STOCKS_CHANNELS_TAB_PAGINATOR_ERROR =
  'STOCKS_CHANNELS_TAB_PAGINATOR_ERROR';

export const TRENDING_CHANNELS_TAB_PAGINATOR_SUCCESS =
  'TRENDING_CHANNELS_TAB_PAGINATOR_SUCCESS';
export const TRENDING_CHANNELS_TAB_PAGINATOR_ERROR =
  'TRENDING_CHANNELS_TAB_PAGINATOR_ERROR';

export const getPageForTrendingTab = () => async (dispatch, getState) => {
  try {
    const current_tab_state = getState().trending_channels_tab_paginator;
    if (current_tab_state.stop) {
      return [];
    }
    const nextPage = ++current_tab_state.page;
    const list = await Client4.getChannelsBy({
      page: nextPage,
      per_page: PER_PAGE_DEFAULT,
      is_stock: true,
    });
    dispatch(
      getPageForTrendingTabSuccess({
        page: nextPage,
        stop: list.length === 0,
      }),
    );
    dispatch(getChannelsSucess(list));
    return list;
  } catch (ex) {
    dispatch(getPageForTrendingTabError(ex));
    return await Promise.reject(ex);
  }
};

function getPageForTrendingTabSuccess(payload) {
  return {
    type: TRENDING_CHANNELS_TAB_PAGINATOR_SUCCESS,
    payload,
  };
}

function getPageForTrendingTabError(err) {
  return {
    type: TRENDING_CHANNELS_TAB_PAGINATOR_ERROR,
    payload: err,
  };
}

export const getPageForStocksTab = () => async (dispatch, getState) => {
  try {
    const current_tab_state = getState().stocks_channels_tab_paginator;
    if (current_tab_state.stop) {
      return [];
    }
    const nextPage = ++current_tab_state.page;
    const list = await Client4.getChannelsBy({
      page: nextPage,
      per_page: PER_PAGE_DEFAULT,
      is_stock: true,
    });
    dispatch(
      getPageForStocksTabSuccess({
        page: nextPage,
        stop: list.length === 0,
      }),
    );
    dispatch(getChannelsSucess(list));
    return list;
  } catch (ex) {
    dispatch(getPageForStocksTabError(ex));
    return await Promise.reject(ex);
  }
};

function getPageForStocksTabSuccess(payload) {
  return {
    type: STOCKS_CHANNELS_TAB_PAGINATOR_SUCCESS,
    payload,
  };
}

function getPageForStocksTabError(err) {
  return {
    type: STOCKS_CHANNELS_TAB_PAGINATOR_ERROR,
    payload: err,
  };
}

export const getPageForNewTab = () => async (dispatch, getState) => {
  try {
    const current_tab_state = getState().new_channels_tab_paginator;
    if (current_tab_state.stop) {
      return [];
    }
    const nextPage = ++current_tab_state.page;
    const list = await Client4.getChannelsBy({
      page: nextPage,
      per_page: PER_PAGE_DEFAULT,
      orderBy: 'CreateAt,DESC',
      created_after: moment()
        .add(-3, 'days')
        .valueOf(),
    });
    dispatch(
      getPageForNewTabSuccess({
        page: nextPage,
        stop: list.length === 0,
      }),
    );
    dispatch(getChannelsSucess(list));
    return list;
  } catch (ex) {
    dispatch(getPageForNewTabError(ex));
    return await Promise.reject(ex);
  }
};

function getPageForNewTabSuccess(payload) {
  return {
    type: NEW_CHANNELS_TAB_PAGINATOR_SUCCESS,
    payload,
  };
}

function getPageForNewTabError(err) {
  return {
    type: NEW_CHANNELS_TAB_PAGINATOR_ERROR,
    payload: err,
  };
}

export const getPageForAllTab = (filter_ids = []) => async (
  dispatch,
  getState,
) => {
  try {
    const current_tab_state = getState().all_channels_tab_paginator;
    if (current_tab_state.stop) {
      return [];
    }
    const nextPage = ++current_tab_state.page;
    const list = await Client4.getChannelsBy({
      page: nextPage,
      per_page: PER_PAGE_DEFAULT,
      orderBy: 'CreateAt,DESC',
      is_stock: 'false',
      is_crypto: 'false',
    });
    dispatch(
      getPageForAllTabSuccess({
        page: nextPage,
        stop: list.length === 0,
      }),
    );
    dispatch(getChannelsSucess(list));
    return list;
  } catch (ex) {
    dispatch(getPageForAllTabError(ex));
    return await Promise.reject(ex);
  }
};

function getPageForAllTabSuccess(payload) {
  return {
    type: ALL_CHANNELS_TAB_PAGINATOR_SUCCESS,
    payload,
  };
}

function getPageForAllTabError(err) {
  return {
    type: ALL_CHANNELS_TAB_PAGINATOR_ERROR,
    payload: err,
  };
}
