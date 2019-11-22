import Client4 from '../api/MattermostClient';

export const SET_CHART_POPUP_VALUE = 'SET_CHART_POPUP_VALUE';
export const SET_CHART_POPUP_SYMBOL_VALUE = 'SET_CHART_POPUP_SYMBOL_VALUE';
export const CLOSE_CHART_POPUP = 'CLOSE_CHART_POPUP';
export const OPEN_CHART_POPUP = 'OPEN_CHART_POPUP';

export const setPopupValue = data => ({
  type: SET_CHART_POPUP_VALUE,
  payload: data,
});

export const setPopupSymbolValue = symbol_value => {
  return async (dispatch, getState) => {
    try {
      const parseName = symbol_value
        .replace('$', '')
        .replace('#', '')
        .toLowerCase();

      const is_chat = getState().myChannelsMap.find(({name}) => {
        return name.toLowerCase() === parseName;
      });

      dispatch({
        type: SET_CHART_POPUP_SYMBOL_VALUE,
        payload: {
          symbol: symbol_value,
          is_chat,
        },
      });
      const data = await Client4.getSymbolTicket(parseName);
      dispatch({
        type: SET_CHART_POPUP_SYMBOL_VALUE,
        payload: {
          ...data,
          is_chat,
        },
      });
    } catch (ex) {
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
