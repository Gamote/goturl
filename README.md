# goturl

[![NPM version](https://img.shields.io/npm/v/goturl.svg?style=flat)](https://www.npmjs.com/package/goturl)
[![NPM downloads](https://img.shields.io/npm/dm/goturl.svg?style=flat)](https://www.npmjs.com/package/goturl)
![Fastify](https://img.shields.io/badge/-Vitest-86b91a?style=flat&logo=vitest&logoColor=white)

**goturl** - the library that tries to do its best to extract urls from strings.

## Installation

```bash
yarn add goturl
```

## Usage

```ts
import { extractUrl } from 'goturl';

extractUrl("Visit https://example.com for more info");
// => https://example.com

extractUrl("Website: another-one.com");
// => another-one.com

extractUrl("Don't forget about this.com/thing?query=string", { fallbackProtocol: 'https' });
// => https://this.com/thing?query=string

extractUrl("Check out our promotions: http://promotion.com http://promotion.com/real/offer", { getLongestUrl: true });
// => http://promotion.com/real/offer

extractUrl("Quick reminder, check out our websitehttps://hurry.com/mistake", { tryFixProtocol: true });
// => https://hurry.com/mistake

extractUrl("Visit https://example.com/my-(awesome)-path for more info", { includeParentheses: true });
// => https://example.com/my-(awesome)-path
```

## Testing

```bash
yarn test
```
