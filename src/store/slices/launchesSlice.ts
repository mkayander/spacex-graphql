import { createSlice, PayloadAction, ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "../index";
import { GetLaunchesDocument, GetLaunchesQuery, GetLaunchesQueryVariables } from "../../api/generated/queries";
import apollo from "../../api/apollo";

type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

export type Launch = ArrayElement<GetLaunchesQuery["launchesPast"]>;

type LaunchesState = {
  loading: boolean;
  offsetStep: number;
  isFull: boolean;
  data: Launch[];
  error?: Error;
};

const initialState: LaunchesState = {
  loading: false,
  isFull: false,
  data: [],
  offsetStep: 10,
};

const launchesSlice = createSlice({
  name: "launches",
  initialState,
  reducers: {
    fetch: state => {
      state.loading = true;
    },
    finish: (state, action: PayloadAction<boolean>) => {
      state.loading = false;
      state.isFull = action.payload;
    },
    updateAll: (state, action: PayloadAction<Launch[]>) => {
      state.data = action.payload;
    },
    append: (state, action: PayloadAction<Launch[]>) => {
      state.data = [...state.data, ...action.payload];
    },
    error: (state, action: PayloadAction<Error>) => {
      state.error = action.payload;
    },
  },
});

export const launchesActions = launchesSlice.actions;

export const selectLaunches = (state: RootState) => state.launches;

export default launchesSlice.reducer;

// Thunk Actions

export const fetchNextLaunches = (): ThunkAction<void, RootState, unknown, any> => {
  return async (dispatch, getState) => {
    dispatch(launchesActions.fetch());

    let isFull = false;

    try {
      const { offsetStep, data } = getState().launches;
      const response = await apollo.query<GetLaunchesQuery, GetLaunchesQueryVariables>({
        query: GetLaunchesDocument,
        variables: { limit: offsetStep, offset: data.length },
      });
      const result = response.data.launchesPast;

      console.log("Got result - ", result);

      if (result?.length && result.length > 0) {
        dispatch(launchesActions.append(result));
      } else {
        isFull = true;
        // dispatch(launchesActions.error(new Error("Got empty launches result!")));
      }
    } catch (e) {
      dispatch(launchesActions.error(e as Error));
    } finally {
      dispatch(launchesActions.finish(isFull));
    }
  };
};
