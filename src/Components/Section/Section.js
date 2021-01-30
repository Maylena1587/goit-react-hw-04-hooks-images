import React from 'react';
import styles from './Section.module.css';

function Section({ title, children }) {
  return (
    <section className={styles.section}>
      <p className={styles.title}>{title}</p>
      {children}
    </section>
  );
}

export default Section;
