import { useEffect, useCallback, useRef } from "react";

export default function useMountedState() {
  const mountedRef = useRef(false);
  // const getState = useCallback(() => mountedRef.current, []);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return mountedRef.current;
}
