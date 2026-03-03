const DEFAULT_BASE_URL = 'https://challenge.captchacat.com';

export function generateHTML(options: {
  siteKey: string;
  baseUrl?: string;
  language?: string;
  callbackName: string;
}): string {
  const baseUrl = options.baseUrl || DEFAULT_BASE_URL;
  const langAttr = options.language
    ? `data-language="${options.language}"`
    : '';

  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: transparent; overflow: hidden; }
    .captcha-widget { width: 100%; }
  </style>
</head>
<body>
  <div class="captcha-widget"
       data-sitekey="${options.siteKey}"
       data-domain="${new URL(baseUrl).hostname}"
       data-token-callback="${options.callbackName}"
       ${langAttr}>
  </div>
  <script>
    // Bridge: forward token to React Native via postMessage
    window.${options.callbackName} = function(token) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'token',
        value: token
      }));
    };

    // Report errors to React Native
    window.addEventListener('error', function(e) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'error',
        value: e.message || 'Unknown error'
      }));
    });

    // Auto-height: report content height changes
    var lastHeight = 0;
    function reportHeight() {
      var h = document.body.scrollHeight;
      if (h !== lastHeight) {
        lastHeight = h;
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'height',
          value: h
        }));
      }
    }
    new MutationObserver(reportHeight).observe(document.body, {
      childList: true, subtree: true, attributes: true
    });
    setInterval(reportHeight, 500);
  </script>
  <script src="${baseUrl}/ray/widget.js"></script>
</body>
</html>`;
}
