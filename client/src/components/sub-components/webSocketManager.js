import { useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { toast } from 'react-toastify';

const useWebSocket = () => {
  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('WebSocket connected');

        // Push event notifications
        stompClient.subscribe('/topic/push', (message) => {
          toast.info(`🚀${message.body}`);
        });

        stompClient.subscribe('/topic/error', (message) => {
          toast.error(`Error : ${message.body}`);
        });

        // stompClient.subscribe('/topic/clone', (message) => {
        //   toast.info(`${message.body}`);
        // });

        // Build status notifications
        stompClient.subscribe('/topic/build', (message) => {
          toast.success(`🛠️${message.body}`);
        });

        // stompClient.subscribe('/topic/test', (message) => {
        //   toast.success(`🤺${message.body}`);
        // });
      },
      onStompError: (frame) => {
        console.error('WebSocket error', frame);
        toast.error('WebSocket connection failed');
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);
};

export default useWebSocket;
