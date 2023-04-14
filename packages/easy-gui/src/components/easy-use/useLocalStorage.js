import { useState, useEffect } from "react";

const useLocalStorage = key => {
  const [state, setState] = useState(() => {
    try {
      const localStorageValue = localStorage.getItem(key);
      return JSON.parse(localStorageValue || "null");
    } catch (error) {
      console.error(error);
    }
  });

  useEffect(() => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem(key, serializedState);
    } catch (error) {
      console.error(error);
    }
  }, [state]);

  return [state, setState];
};

export default useLocalStorage;
