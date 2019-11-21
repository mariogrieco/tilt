export const SET_CHART_POPUP_VALUE = 'SET_CHART_POPUP_VALUE';
export const SET_CHART_POPUP_SYMBOL_VALUE = 'SET_CHART_POPUP_SYMBOL_VALUE';
export const CLOSE_CHART_POPUP = 'CLOSE_CHART_POPUP';
export const OPEN_CHART_POPUP = 'OPEN_CHART_POPUP';

export const setPopupValue = data => ({
  type: SET_CHART_POPUP_VALUE,
  payload: data,
});

export const setPopupSymbolValue = symbol_value => {
  return (dispatch, getState) => {
    try {
      dispatch({
        type: SET_CHART_POPUP_SYMBOL_VALUE,
        payload: {
          symbol: symbol_value,
          is_chat: getState().myChannelsMap.find(({name}) => {
            return (
              name.toLowerCase() ===
              symbol_value
                .replace('$', '')
                .replace('#', '')
                .toLowerCase()
            );
          }),
        },
      });
      // const data await 
      // dispatch_new
    } catch (ex) {
      return Promise.reject(ex);
    }
  };
};

export const closePopup = () => ({
  type: CLOSE_CHART_POPUP,
});

export const openPopup = () => ({
  type: OPEN_CHART_POPUP,
});
