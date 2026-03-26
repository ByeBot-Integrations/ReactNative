import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { generateHTML } from './html';
import type { ByebotProps } from './types';

const DEFAULT_BASE_URL = 'https://challenge.byebot.de';
const DEFAULT_HEIGHT = 60;

export const Byebot: React.FC<ByebotProps> = ({
  siteKey,
  baseUrl = DEFAULT_BASE_URL,
  language,
  onVerify,
  onError,
  onExpired,
  style,
}) => {
  const [height, setHeight] = useState(DEFAULT_HEIGHT);

  // Stable callback refs to avoid stale closures
  const onVerifyRef = useRef(onVerify);
  onVerifyRef.current = onVerify;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  const onExpiredRef = useRef(onExpired);
  onExpiredRef.current = onExpired;

  // Unique callback name (stable across renders)
  const callbackName = useMemo(
    () => `byebot_cb_${Math.random().toString(36).substring(2, 9)}`,
    [],
  );

  const html = useMemo(
    () => generateHTML({ siteKey, baseUrl, language, callbackName }),
    [siteKey, baseUrl, language, callbackName],
  );

  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      switch (data.type) {
        case 'token':
          onVerifyRef.current?.(data.value);
          break;
        case 'error':
          onErrorRef.current?.(data.value);
          break;
        case 'expired':
          onExpiredRef.current?.();
          break;
        case 'height':
          setHeight(Math.max(data.value, DEFAULT_HEIGHT));
          break;
      }
    } catch {
      // Ignore non-JSON messages
    }
  }, []);

  return (
    <View style={[{ height, overflow: 'hidden' }, style]}>
      <WebView
        source={{ html, baseUrl }}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        bounces={false}
        onMessage={handleMessage}
        style={{ flex: 1, backgroundColor: 'transparent' }}
        onError={(syntheticEvent) => {
          onErrorRef.current?.(
            syntheticEvent.nativeEvent.description || 'WebView load failed',
          );
        }}
      />
    </View>
  );
};
