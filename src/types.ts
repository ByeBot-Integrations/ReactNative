import type { ViewStyle } from 'react-native';

export interface CaptchacatProps {
  /** Your site's public key */
  siteKey: string;
  /** Challenge backend URL (default: https://challenge.captchacat.com) */
  baseUrl?: string;
  /** Override widget language (e.g., "de", "fr") */
  language?: string;
  /** Called when the challenge is solved with the verification token */
  onVerify?: (token: string) => void;
  /** Called when the widget encounters an error */
  onError?: (error: string) => void;
  /** Called when the token expires */
  onExpired?: () => void;
  /** Container style overrides */
  style?: ViewStyle;
}
