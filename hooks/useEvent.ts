import { useEffect } from 'react';

const useEvent = (eventName: string, handler: (event: Event) => void, element: HTMLElement | Window = window) => {
  useEffect(() => {
    element.addEventListener(eventName, handler);
    return () => {
      element.removeEventListener(eventName, handler);
    };
  }, [eventName, handler, element]);
};

export default useEvent;