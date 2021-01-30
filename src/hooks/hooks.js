import { useDebugValue, useState, useEffect, useRef } from 'react';

function useStateWithLabel(initialValue, name) {
  const [value, setValue] = useState(initialValue);
  useDebugValue(`${name}: ${value}`);
  return [value, setValue];
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const customHooks = {
  useStateWithLabel,
  usePrevious,
};

export default customHooks;
