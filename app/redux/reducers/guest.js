import { handleActions } from 'redux-actions';
import {
  UPDATE_FOLLOW_DETAIL,
  DELETE_GUEST,
  SET_OWNER_RESOURCELIST,
  ADD_OWNER_RESOURCE,
  UPDATE_OWNER_RESOURCE,
  CLEAR_OWNER_RESOURCELIST,
  SET_FOLLOWLIST,
  ADD_FOLLOW_DETAIL,
  CLEAR_FOLLOWLIST
} from '../actionTypes';

const initState = {
  data: [[], []],
  followList: []
};

const guestGet = handleActions(
  {
    [SET_OWNER_RESOURCELIST]: (state, action) => {
      const list = action.payload.data;
      const index = action.payload.index;
      if (list.length === 0) {
        return {
          ...state
        };
      } else {
        state.data[index].push(...list);
        return {
          ...state
        };
      }
    },
    [CLEAR_OWNER_RESOURCELIST]: (state, action) => {
      const index = action.payload.index;
      if (index === 0 || index === 1) {
        initState.data[action.payload.index] = [];
      } else {
        initState.data[0] = [];
        initState.data[1] = [];
      }
      return {
        ...state,
        data: initState.data
      };
    },
    [ADD_OWNER_RESOURCE]: (state, action) => {
      state.data[1].unshift(action.payload.data);
      return {
        ...state
      }
    },
    [UPDATE_OWNER_RESOURCE]: (state, action) => {
      const data = action.payload;
      const key = data.ClientType === 3 ? 0 : 1; /**0:公客数据, 1:私客数据 */
      const index = state.data[key].findIndex((val) => {
        return val.KeyID === data.KeyID
      });
      state.data[key].splice(index, 1, data);
      return {
        ...state
      }
    },
    [UPDATE_FOLLOW_DETAIL]: (state, action) => {
      const key = action.payload.Guest;
      const KeyID = action.payload.KeyID;
      const followDetail = action.payload.followDetail;
      const _list = state[key];
      _list.forEach((value, index) => {
        if (value.KeyID === KeyID) {
          _list[index] = { ...value, followDetail };
        }
      });
      return {
        ...state,
        [key]: _list
      };
    },
    [DELETE_GUEST]: (state, action) => {
      const KeyID = action.payload.KeyID;
      const key = action.payload.Guest;
      const newData = state.data[key].filter(val => val.KeyID !== KeyID);
      state.data[key] = newData;
      return {
        ...state
      };
    },
    /**跟进列表 */
    [SET_FOLLOWLIST]: (state, action) => {
      const followList = action.payload.data;
      return {
        ...state,
        followList
      };
    },
    [ADD_FOLLOW_DETAIL]: (state, action) => {
      state.followList.unshift(action.payload);
      return {
        ...state
      };
    },
    [CLEAR_FOLLOWLIST]: (state, action) => {
      state.followList = [];
      return {
        ...state
      };
    }
  },
  initState
);

export default guestGet;
