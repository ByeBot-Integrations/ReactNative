# @captchacat/react-native

React Native integration for [Captchacat](https://captchacat.com) — a GDPR-compliant, proof-of-work CAPTCHA service.

## Installation

```bash
npm install @captchacat/react-native react-native-webview
```

`react-native-webview` is a required peer dependency.

For iOS, run `cd ios && pod install` after installing.

## Usage

```tsx
import { Captchacat } from '@captchacat/react-native';
import { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

function LoginScreen() {
  const [token, setToken] = useState<string | null>(null);

  return (
    <View style={{ padding: 16 }}>
      <TextInput placeholder="Email" />
      <TextInput placeholder="Password" secureTextEntry />

      <Captchacat
        siteKey="your-site-key"
        onVerify={(t) => setToken(t)}
        onError={(e) => Alert.alert('Error', e)}
      />

      <Button
        title="Sign In"
        disabled={!token}
        onPress={() => submitLogin(token!)}
      />
    </View>
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `siteKey` | `string` | Yes | Your site's public key |
| `baseUrl` | `string` | No | Challenge backend URL (default: `https://challenge.captchacat.com`) |
| `language` | `string` | No | Override widget language (e.g., `"de"`, `"fr"`) |
| `onVerify` | `(token: string) => void` | No | Called when the challenge is solved |
| `onError` | `(error: string) => void` | No | Called on load or runtime error |
| `onExpired` | `() => void` | No | Called when the token expires |
| `style` | `ViewStyle` | No | Container style overrides |

## How It Works

The SDK renders the Captchacat widget inside a WebView. The existing `widget.js` handles the full challenge flow (PoW solving, fingerprinting, interactive challenges). A JavaScript bridge intercepts the verification token and passes it to your React Native app.

## Server-Side Validation

After receiving the token, validate it on your backend:

```
POST https://challenge.captchacat.com/validate_token

{
  "api_key": "your-secret-api-key",
  "token": "token-from-sdk"
}
```

## License

MIT
