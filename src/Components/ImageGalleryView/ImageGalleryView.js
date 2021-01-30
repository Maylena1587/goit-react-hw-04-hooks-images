import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { css } from '@emotion/react';
import RingLoader from 'react-spinners/RingLoader';
import ProgressiveImage from 'react-progressive-image';
import PropTypes from 'prop-types';
import s from './ImageGalleryView.module.css';
import imageAPI from '../../services/pixabay-api';
import initialScreenPlaceholder from '../../images/initialScreenPlaceholder.jpg';
import errorPlaceholder from '../../images/errorPlaceholder.jpg';
import Modal from '../Modal';
import ImageGallery from '../ImageGallery';
import customHooks from '../../hooks/hooks.js';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

const { useStateWithLabel, usePrevious } = customHooks;

function ImageGalleryView({
  searchQuery,
  page,
  resetSearchPage,
  updateImageAvialability,
}) {
  const [images, setImages] = useStateWithLabel(null, 'images');
  const [totalSearchResults, setTotalSearchResults] = useStateWithLabel(
    null,
    'totalSearchResults',
  );
  const [status, setStatus] = useStateWithLabel(Status.IDLE, 'status');
  const [modalIsOpen, setModalIsOpen] = useStateWithLabel(false, 'modalIsOpen');
  const [imageInModal, setImageInModal] = useStateWithLabel('', 'imageInModal');
  const [activeImage, setActiveImage] = useStateWithLabel('', 'activeImage');

  const prevQuery = usePrevious(searchQuery);

  useEffect(() => {
    if (prevQuery !== searchQuery && searchQuery !== '') {
      resetSearchPage();
      setStatus(Status.PENDING);

      imageAPI
        .fetchImages(searchQuery)
        .then(images => {
          console.log(images);
          if (images.totalHits === 0) {
            toast.error(
              `No images for ${searchQuery}. Please try another query.`,
            );
            setStatus(Status.REJECTED);
            return;
          }
          if (images.hits.length === 0) {
            toast.error(
              `Oops! Pixabay failed us and forgot to send images. Please refresh page & try again.`,
            );
            setStatus(Status.REJECTED);
            return;
          }
          setImages(images.hits);
          setTotalSearchResults(images.totalHits);
          setStatus(Status.RESOLVED);
        })
        .catch(error => {
          setStatus(Status.REJECTED);
        });
    }
  }, [
    prevQuery,
    resetSearchPage,
    searchQuery,
    setImages,
    setStatus,
    setTotalSearchResults,
    updateImageAvialability,
  ]);

  useEffect(() => {
    if (images && status === Status.RESOLVED) {
      const result = totalSearchResults > images.length ? true : false;
      updateImageAvialability(result);
    } else {
      updateImageAvialability(false);
    }
  }, [images, status, totalSearchResults, updateImageAvialability]);

  const prevPage = usePrevious(page);

  useEffect(() => {
    if (prevPage < page) {
      imageAPI
        .fetchImages(searchQuery, page)
        .then(images => {
          setImages(state => {
            return [...state, ...images.hits];
          });
        })
        .catch(error => {
          setStatus(Status.REJECTED);
        })
        .finally(data => {
          window.scrollTo({
            top: document.documentElement.scrollHeight - 1300,
            behavior: 'smooth',
          });
        });
    }
  }, [
    page,
    prevPage,
    searchQuery,
    setImages,
    setStatus,
    updateImageAvialability,
  ]);

  const toggleModal = () => {
    setModalIsOpen(state => !state);
    setImageInModal('');
    setActiveImage('');
  };

  const showBigImageInModal = e => {
    toggleModal();
    setImageInModal(state => (state ? '' : e.target.dataset.image));
    setActiveImage(state => (state ? '' : e.target.src));
  };

  if (status === Status.IDLE) {
    return (
      <div>
        <img src={initialScreenPlaceholder} alt="please enter a query" />
      </div>
    );
  }

  if (status === Status.PENDING) {
    return (
      <RingLoader
        css={css`
          margin-top: 80px;
        `}
        size={200}
        color={'purple'}
        loading={true}
      />
    );
  }

  if (status === Status.REJECTED) {
    return (
      <div>
        <img src={errorPlaceholder} alt="error" />
      </div>
    );
  }

  if (status === Status.RESOLVED) {
    return (
      <>
        <ImageGallery
          images={images}
          showBigImageInModal={showBigImageInModal}
        />
        {modalIsOpen && (
          <Modal toggleModal={toggleModal}>
            <ProgressiveImage src={imageInModal} placeholder={activeImage}>
              {(src, loading) => (
                <img
                  style={{ opacity: loading ? 0.5 : 1 }}
                  src={src}
                  alt=""
                  className={s.image}
                />
              )}
            </ProgressiveImage>
          </Modal>
        )}
      </>
    );
  }
}

export default ImageGalleryView;

ImageGalleryView.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  resetSearchPage: PropTypes.func.isRequired,
  updateImageAvialability: PropTypes.func.isRequired,
};
