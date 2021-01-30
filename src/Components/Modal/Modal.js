import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaWindowClose } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import PropTypes from 'prop-types';
import s from './Modal.module.css';

const modalRoot = document.querySelector('#modal-root');

function Modal({ toggleModal, children }) {
  useEffect(() => {
    const handleModalClosureOnEsc = e => {
      if (e.code === 'Escape') {
        toggleModal();
      }
    };
    window.addEventListener('keydown', handleModalClosureOnEsc);
    return () => {
      window.removeEventListener('keydown', handleModalClosureOnEsc);
    };
  });

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      toggleModal();
    }
  };

  return createPortal(
    <div className={s.backdrop} onClick={handleBackdropClick}>
      <div className={s.content}>
        <button className={s.closeIcon} onClick={() => toggleModal()}>
          <IconContext.Provider value={{ size: '36px' }}>
            <FaWindowClose />
          </IconContext.Provider>
        </button>
        {children}
      </div>
    </div>,
    modalRoot,
  );
}

export default Modal;

Modal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
};
