// BuildEventListener.js
import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BuildEventListener = () => {
  useEffect(() => {
    const eventSource = new EventSource(
      'http://localhost:8080/api/build/stream'
    );

    // eventSource.addEventListener('buildEvent', (event) => {
    //   toast.info(event.data, { position: 'bottom-right' });
    // });

    eventSource.onmessage = (event) => {
      toast.info(event.data, {
        position: 'bottom-right',
        autoClose: 5000,
      });
    };

    eventSource.onerror = () => {
      toast.error('Lost connection to build events stream.');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return <ToastContainer />;
};

export default BuildEventListener;
