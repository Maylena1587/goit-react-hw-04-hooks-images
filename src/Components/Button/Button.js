import React from 'react';
import PropTypes from 'prop-types';
import s from './Button.module.css';

function Button({ updateSearchPage }) {
  return (
    <button className={s.btn} onClick={updateSearchPage}>
      Load more
    </button>
  );
}

export default Button;

Button.propTypes = {
  updateSearchPage: PropTypes.func.isRequired,
};
