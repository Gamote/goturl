import { it, describe, expect } from 'vitest';

import { extractUrl } from '../src';

const extractUrlWrapper = (input: string): string | null =>
  extractUrl(`Visit ${input}`, {
    getLongestUrl: true,
    tryFixProtocol: true,
    fallbackProtocol: 'https',
  });

describe('extractUrl', () => {
  it('Should match', () => {
    expect(
      extractUrl(
        'Quick reminder, check out our websitehttps://hurry.com/mistake',
        { tryFixProtocol: true },
      ),
    ).toBe('https://www.domain.com/product/stuff-P469825');

    expect(
      extractUrlWrapper('https://www.domain.com/product/stuff-P469825'),
    ).toBe('https://www.domain.com/product/stuff-P469825');

    expect(
      extractUrlWrapper('https://www.domain.com/product/stuff-P469825'),
    ).toBe('https://www.domain.com/product/stuff-P469825');

    expect(
      extractUrlWrapper('https://domain.com/product/stuff-P449800?id=2255528'),
    ).toBe('https://domain.com/product/stuff-P449800?id=2255528');

    expect(extractUrlWrapper('http://withoutssl.com/match-me')).toBe(
      'http://withoutssl.com/match-me',
    );

    expect(extractUrlWrapper('www.test.com')).toBe('https://www.test.com');

    expect(extractUrlWrapper('domain.com/with-query-params?param=1')).toBe(
      'https://domain.com/with-query-params?param=1',
    );

    expect(
      extractUrlWrapper(
        'domain.com/with-query-params?param=1 https://choose.me/instead/i-am-longer-than-previous',
      ),
    ).toBe('https://choose.me/instead/i-am-longer-than-previous');

    expect(extractUrlWrapper('Visithttps://you-can.com/correct-me')).toBe(
      'https://you-can.com/correct-me',
    );
  });

  it('Should not match', () => {
    expect(extractUrlWrapper('https://dont-match-me')).toBe(null);
    expect(extractUrlWrapper('http://dont-match-me/either')).toBe(null);
    expect(extractUrlWrapper('ofc-not-you-will-never-match-me :)')).toBe(null);
  });
});
