import urlRegexSafe from 'url-regex-safe';

type ExtractUrlOptions = {
  getLongestUrl?: boolean;
  tryFixProtocol?: boolean;
  fallbackProtocol?: string;
};

/**
 * This method will try to fix the protocol of the uri if it's not one of the supported protocols.
 *
 * This is useful for cases when a mistake happened in the input
 * E.g.: without the fix "Visithttps://test.com" will result in "Visithttps://test.com", but with the fix it will result in "https://test.com".
 *
 * @param uri
 * @param supportedProtocols
 */
const tryFixUriProtocol = (
  uri: string,
  supportedProtocols = ['https', 'http'],
): { uri: string; touched: boolean } => {
  const strings = uri.split('://');

  if (strings.length > 1) {
    // Remove duplicates from the array and order by the longest string. This is so we don't wrongly replace protocols.
    // For example, in case we would have to check if the string includes "http" first and the string would be "https://test.com"
    // we would wrongly replace the protocol to "http"
    const assertedSupportedProtocols = [...new Set(supportedProtocols)].sort(
      (a, b) => b.length - a.length,
    );

    for (const protocol of assertedSupportedProtocols) {
      if (strings[0].includes(protocol)) {
        return { uri: uri.replace(strings[0], protocol), touched: true };
      }
    }
  }

  return { uri, touched: false };
};

/**
 * This method is going to extract the first url found in the input string
 * using the {@link urlRegexSafe} from the `url-regex-safe` package.
 *
 * @param input
 * @param options
 */
const extractUrl = (
  input: unknown,
  options?: ExtractUrlOptions,
): null | string => {
  const supportedProtocols = ['https', 'http'];

  try {
    if (typeof input === 'string') {
      const matches = input.match(urlRegexSafe());

      if (!matches || matches.length === 0) {
        return null;
      }

      const urls = matches.reduce((urls, url) => {
        // Remove spaces from start and end
        url = url.trim();

        // Do not allow too short URLs
        if (url.length <= 3) {
          return urls;
        }

        // Try to fix the protocol if the option is set to "true"
        if (options?.tryFixProtocol) {
          url = tryFixUriProtocol(url).uri;
        }

        // If it has a protocol, and it's not one of the supported protocols, return null
        if (
          url.includes('://') &&
          !supportedProtocols.some((protocol) => url.includes(`${protocol}://`))
        ) {
          return urls;
        }

        // Use fallback protocol if the protocol is not specified
        if (options?.fallbackProtocol && !url.includes('://')) {
          url = `${options.fallbackProtocol}://${url}`;
        }

        urls.push(url);

        return urls;
      }, [] as string[]);

      // By default, we will return the first match, but if the option is set to true we will return the longest match
      return options?.getLongestUrl
        ? urls.reduce((a, b) => (a.length > b.length ? a : b), '')
        : urls[0];
    } else {
      return null;
    }
  } catch (_) {
    return null;
  }
};

export default extractUrl;
