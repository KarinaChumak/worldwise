import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useReducer,
} from 'react';

const CitiesContext = createContext();

const db_url = 'https://worldwise-json-server.onrender.com';

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: '',
};
function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true };

    case 'city/created':
      return {
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
        currentCity: action.payload,
      };

    case 'cities/loaded':
      return { ...state, isLoading: false, cities: action.payload };

    case 'city/loaded':
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };

    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter(
          (city) => city.id !== action.payload
        ),
      };

    case 'rejected':
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error('Unknown error type');
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] =
    useReducer(reducer, initialState);

  useEffect(function () {
    const fetchCities = async () => {
      dispatch({ type: 'loading' });
      try {
        const res = await fetch(`${db_url}/cities`);

        const data = await res.json();
        dispatch({ type: 'cities/loaded', payload: data });
      } catch (err) {
        dispatch({
          type: 'rejected',
          payload: 'There was an error loading the cities',
        });
      }
    };

    fetchCities();
  }, []);

  const fetchCity = useCallback(
    async function fetchCity(id) {
      if (Number(id) === currentCity.id) return;
      dispatch({ type: 'loading' });

      try {
        const res = await fetch(`${db_url}/cities/${id}`);
        const data = await res.json();
        dispatch({ type: 'city/loaded', payload: data });
      } catch (err) {
        dispatch({
          type: 'rejected',
          payload: 'There was an error loading the city',
        });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    dispatch({ type: 'loading' });
    try {
      const res = await fetch(`${db_url}/cities`, {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: { 'Content-type': 'application/json' },
      });
      const data = await res.json();
      dispatch({ type: 'city/created', payload: data });
    } catch (err) {
      dispatch({
        type: 'rejected',
        payload: 'There was an error creating the city',
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: 'loading' });

    try {
      const res = await fetch(`${db_url}/cities/${id}`, {
        method: 'DELETE',
      });

      dispatch({
        type: 'city/deleted',
        payload: id,
      });
    } catch (err) {
      dispatch({
        type: 'rejected',
        payload: 'There was an error deleting the city',
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        fetchCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error(
      'Trying to react Cities Context outside of the provider'
    );
  return context;
}

export { useCities, CitiesProvider };
