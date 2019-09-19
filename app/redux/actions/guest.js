import {
  DELETE_GUEST,
  SET_OWNER_RESOURCELIST,
  ADD_OWNER_RESOURCE,
  CLEAR_OWNER_RESOURCELIST,
  SET_FOLLOWLIST,
  CLEAR_FOLLOWLIST,
  ADD_FOLLOW_DETAIL,
  UPDATE_OWNER_RESOURCE
} from '../actionTypes';
import { createAction } from 'redux-actions';
export const deleteGuest = createAction(DELETE_GUEST);
export const setOwnerResourceList = createAction(SET_OWNER_RESOURCELIST);
export const addOwnerResource = createAction(ADD_OWNER_RESOURCE);
export const updateOwnerResource = createAction(UPDATE_OWNER_RESOURCE);
export const clearOwnerResourceList = createAction(CLEAR_OWNER_RESOURCELIST);
export const setFollowList = createAction(SET_FOLLOWLIST);
export const clearFollowList = createAction(CLEAR_FOLLOWLIST);
export const addFollowDetail = createAction(ADD_FOLLOW_DETAIL);
