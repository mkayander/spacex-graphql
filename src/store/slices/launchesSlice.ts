import { createSlice, PayloadAction, ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "../index";
import { GetLaunchesDocument, GetLaunchesQuery, GetLaunchesQueryVariables } from "../../api/generated/queries";
import apollo from "../../api/apollo";

type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

export type Launch = ArrayElement<GetLaunchesQuery["launchesPast"]>;

type LaunchesState = {
  loading: boolean;
  offsetStep: number;
  data: Launch[];
  error?: Error;
};

const initialState: LaunchesState = {
  loading: false,
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
    update: (state, action: PayloadAction<Launch[]>) => {
      state.data = action.payload;
      state.loading = false;
    },
    error: (state, action: PayloadAction<Error>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const launchesActions = launchesSlice.actions;

export const selectLaunches = (state: RootState) => state.launches;

export default launchesSlice.reducer;

// Thunk Actions

export const fetchLaunchesAction = (): ThunkAction<void, RootState, unknown, any> => {
  return async dispatch => {
    dispatch(launchesActions.fetch());

    try {
      const response = await apollo.query<GetLaunchesQuery, GetLaunchesQueryVariables>({
        query: GetLaunchesDocument,
        variables: { limit: 10, offset: 0 },
      });
      const result = response.data.launchesPast;

      if (result === undefined) {
        dispatch(launchesActions.error(new Error("Got empty launches result!")));
      }

      dispatch(launchesActions.update(response.data.launchesPast || []));
    } catch (e) {
      dispatch(launchesActions.error(e as Error));
    }
  };
};
