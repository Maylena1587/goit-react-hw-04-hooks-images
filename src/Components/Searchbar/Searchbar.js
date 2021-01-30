import React, { useRef } from 'react';
import { FiSearch } from 'react-icons/fi';
import { IconContext } from 'react-icons';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import customHooks from '../../hooks/hooks.js';
import s from './Searchbar.module.css';

const { useStateWithLabel } = customHooks;

function Searchbar({ getSearchQuery }) {
  const [value, setValue] = useStateWithLabel('', 'value');

  const btn = useRef(null);

  const handleSubmit = e => {
    e.preventDefault();
    const query = value.toLowerCase().trim();
    if (query === '') {
      toast.error('Please enter a query');
      btn.current.blur();
      return;
    }
    getSearchQuery(query);
    setValue('');
    btn.current.blur();
  };

  return (
    <header className={s.searchbar}>
      <form className={s.form} onSubmit={handleSubmit}>
        <button type="submit" className={s.btn} ref={btn}>
          <IconContext.Provider value={{ size: '16px' }}>
            <FiSearch />
          </IconContext.Provider>
        </button>
        <input
          className={s.input}
          type="text"
          value={value}
          placeholder="Search images and photos"
          onChange={e => setValue(e.target.value)}
        />
      </form>
    </header>
  );
}

export default Searchbar;

Searchbar.propTypes = {
  getSearchQuery: PropTypes.func.isRequired,
};
