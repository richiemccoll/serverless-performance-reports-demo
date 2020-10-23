import React from 'react';

const states = {
  PENDING: "pending",
  RESOLVED: "resolved",
  REJECTED: "rejected",
};

function asyncReducer(state, action) {
  switch (action.type) {
    case states.PENDING: {
      return { status: states.PENDING, data: null, error: null };
    }
    case states.RESOLVED: {
      return { status: states.RESOLVED, data: action.data, error: null };
    }
    case states.REJECTED: {
      return { status: states.REJECTED, data: null, error: action.error };
    }
    default: {
      return state;
    }
  }
}

function useAsync(initialState) {
  const [state, dispatch] = React.useReducer(asyncReducer, {
    status: initialState.status,
    data: null,
    error: null,
  });

  const run = React.useCallback((promise) => {
    dispatch({ type: states.PENDING });
    promise.then(
      (data) => {
        dispatch({ type: states.RESOLVED, data });
      },
      (error) => {
        dispatch({ type: states.REJECTED, error });
      }
    );
  }, []);

  return { ...state, run };
}

export default useAsync;
