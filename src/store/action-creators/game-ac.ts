import { Dispatch } from 'redux';
import {
  START_GAME,
  SET_USER_SAVES,
  SET_USER_SAVES_ERROR,
  SET_USER_SAVES_LOADING,
  DEL_USER_SAVE,
} from '../actions/gameActions';
import { RESET } from '../actions/settingsActions';
import { SavesType } from '../../types/types';
import savesApi from '../../api/saves-api';

export const gameActions = {
  startGame: (isGameStarted: boolean) =>
    ({
      type: START_GAME,
      payload: { isGameStarted },
    } as const),
  setUserSaves: (userSaves: Array<SavesType>) =>
    ({
      type: SET_USER_SAVES,
      payload: { userSaves },
    } as const),
  setUserSavesError: (userSavesError: string) =>
    ({
      type: SET_USER_SAVES_ERROR,
      payload: { userSavesError },
    } as const),
  setUserSavesLoading: (userSavesLoading: boolean) =>
    ({
      type: SET_USER_SAVES_LOADING,
      payload: { userSavesLoading },
    } as const),
  delUserSave: (id: string) =>
    ({
      type: DEL_USER_SAVE,
      payload: { id },
    } as const),
  reset: () => ({ type: RESET } as const),
};

export const loadUserSaves = (key: string) => async (dispatch: Dispatch) => {
  dispatch(gameActions.setUserSavesLoading(true));
  try {
    const data = await savesApi.getAllSaves(key);
    if (data.data.success) {
      if (data.data.payload.length === 0) {
        dispatch(gameActions.setUserSavesError('No saves'));
      } else {
        dispatch(gameActions.setUserSaves(data.data.payload));
      }
    }
  } catch (e) {
    dispatch(gameActions.setUserSavesError(e.message));
  }
  dispatch(gameActions.setUserSavesLoading(false));
};

export const deleteUserSave = (key: string, id: string) => async (
  dispatch: Dispatch,
) => {
  try {
    const data = await savesApi.deleteSave(key, id);
    if (data.data.success) {
      dispatch(gameActions.delUserSave(id));
    }
  } catch (e) {
    dispatch(gameActions.setUserSavesError(e.message));
  }
};
