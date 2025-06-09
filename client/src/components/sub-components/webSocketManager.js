import { useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { toast } from 'react-toastify';

const useWebSocket = () => {
  useEffect(() => {
    const socket = new SockJS(`${process.env.REACT_APP_BASE_URL}/ws`); // Ensure this URL matches your server's WebSocket endpoint
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('✅ WebSocket connected');

        stompClient.subscribe('/topic/push', (message) => {
          console.log('📨 Push received:', message.body);
          toast.info(`🚀${message.body}`);
        });

        stompClient.subscribe('/topic/error', (message) => {
          console.log('❌ Error received:', message.body);
          toast.error(`Error: ${message.body}`);
        });

        stompClient.subscribe('/topic/build', (message) => {
          console.log('🔧 Build update:', message.body);
          toast.success(`🛠️${message.body}`);
        });
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
