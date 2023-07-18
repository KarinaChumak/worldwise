import styles from './CountryList.module.css';

import Spinner from './Spinner';
import CountryItem from './CountryItem';
import Message from './Message';
import { useCities } from '../contexts/CitiesContext';

function CountryList() {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner></Spinner>;
  if (!cities.length)
    return (
      <Message
        message={
          'Add your first city by clicking on the city on the map'
        }
      >
        {' '}
      </Message>
    );

  const countries = cities.reduce((acc, city) => {
    if (!acc.map((el) => el.country).includes(city.country))
      return [...acc, { emoji: city.emoji, country: city.country }];
    else return acc;
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem
          country={country}
          key={country.country}
        ></CountryItem>
      ))}
    </ul>
  );
}

export default CountryList;
