import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Optional WebSocket hook for real-time log streaming.
 * Connects to a WebSocket server and provides live messages.
 * Falls back gracefully if no WebSocket server is available.
 */
const useWebSocket = (url) => {
  const defaultUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`;
  const finalUrl = url || defaultUrl;
  const wsRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(finalUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        console.log('[WS] Connected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setMessages((prev) => [...prev, data]);
        } catch {
          setMessages((prev) => [...prev, { message: event.data }]);
        }
      };

      ws.onclose = () => {
        setConnected(false);
        console.log('[WS] Disconnected');
      };

      ws.onerror = () => {
        setConnected(false);
      };
    } catch {
      // WebSocket not available, fail silently
    }
  }, [finalUrl]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => disconnect();
  }, [disconnect]);

  return { connect, disconnect, connected, messages, clearMessages: () => setMessages([]) };
};

export default useWebSocket;
