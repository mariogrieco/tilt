import Client4 from '../api/MattermostClient';
import moment from 'moment';

export const SET_CHART_POPUP_VALUE = 'SET_CHART_POPUP_VALUE';
export const SET_CHART_POPUP_SYMBOL_VALUE = 'SET_CHART_POPUP_SYMBOL_VALUE';
export const CLOSE_CHART_POPUP = 'CLOSE_CHART_POPUP';
export const OPEN_CHART_POPUP = 'OPEN_CHART_POPUP';

export const setPopupValue = data => ({
  type: SET_CHART_POPUP_VALUE,
  payload: data,
});

export const setPopupSymbolValue = (symbol_value, showModal) => {
  return async (dispatch, getState) => {
    try {
      const {mapChannels} = getState();

      const parseName = symbol_value
        .replace('$', '')
        .replace('#', '')
        .toLowerCase();

      const is_chat = mapChannels.find(({name}) => {
        return name.toLowerCase() === parseName;
      });

      const infoTicket = await Client4.getSymbolTicket(parseName);

      const {data} = await Client4.getKlines(
        parseName,
        '30m',
        moment()
          .subtract(1, 'days')
          .utc()
          .valueOf(),
      );

      dispatch({
        type: SET_CHART_POPUP_SYMBOL_VALUE,
        payload: {
          ...infoTicket,
          symbol: `${symbol_value}`,
          is_chat,
          chart_data: data,
          isActive: showModal,
        },
      });
    } catch (ex) {
      console.log('ex: ', ex);
      return Promise.resolve(ex);
    }
  };
};

export const closePopup = () => ({
  type: CLOSE_CHART_POPUP,
});

export const openPopup = () => ({
  type: OPEN_CHART_POPUP,
});
