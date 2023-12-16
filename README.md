# Devographics translation sync

Update translation file in target repository based on the original one.

## Prerequisites

- Node.js (20+) + npm

## How it works (locally)

Let's say you have `devographics` folder with cloned locale repos inside of it,
e.g. `locale-en-US` and `locale-ua-UA`.

Clone this repository to have it inside `devographics` as well.

```
             | locale-en-US
devographics | locale-ua-UA
             | devographics-translation-sync
```

### Inside `devographics-translation-sync` folder

#### deps

Install dependencies:

```sh
npm install
```

#### sync

Run this command to update `state_of_js.yml` file in `locale-ua-UA` repo,
basing on the file of the same name in `locale-en-US` repo:

```sh
npm run sync
```

Update locales and file name in `index.js` file up to your needs and run
command again.
