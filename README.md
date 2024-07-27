# Devographics translation sync

It's a tool to sync files in [Devographics](https://github.com/Devographics)
repositories with translations for "State of" projects. You can easily update
translation file in target repository based on the original one.

*Warning: It's a simple tool to parse and compare files in their current state.
It does not depend on the git-based history of changes.*

[Here is a list of all repositories](https://github.com/orgs/Devographics/repositories?q=locale-&type=all&language=&sort=name).
`en-US` locale is considered a base, but it can be any of them as you need.

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

#### env

Create an environment file by example:

```sh
cp .env.example .env
```

Update locales and file name in `.env` file up to your needs before syncing.

#### sync

Run this command to update `state_of_js.yml` file in `locale-ua-UA` repo,
basing on the file of the same name in `locale-en-US` repo:

```sh
npm run sync
```

Also you can either update locales and file name in `.env` file or set/override
them from terminal:

```sh
FILE_NAME=state_of_js.yml BASE_LOCALE=en-US DICT_LOCALE=ua-UA npm run sync
```

- If file is missing in your repo, the base file will be copied.
- All untranslated values will be also extracted into `untranslated-[FILE_NAME]`
file in target repository so you can easily send it to translation services.

#### lint and format

Run this command to lint `js` files (and format in a simple way):

```sh
npm run lint
```

## Caveats

### First syncing

After the first syncing, some additional effects (which is okay) may happen:
- file may be formatted to use 2-space offset between levels;
- comments and values may be shifted as `yml` structure will be revaluated
during parsing;
- double quote is used by default for text wrapping instead of single quote;
- some wrapping quotes may be removed if they are unnecessary;
- paragraphs in folded multiline blocks may become one line,
[explanation](#folded-block).

These effects should not happen later as file will become valid (except for
[known bugs](#known-bugs-in-base-files))

### Folded block

In the folded multiline blocks (`>` operator), paragraph lines should end with
additional space at the end (except for the ending line):

```yml
  t: >
    First part,[one space here]
    second part[one space here]
    and the ending part of paragraph


    New paragraph
```

That's required to correctly reconstruct the original formatting of the folded
blocks. And additional spaces won't break html rendering in browser.

Otherwise, that value will appear as following after syncing :

```yml
  t: >
    First part, second part and the ending part of paragraph


    New paragraph
```

which is correct behavior, though it breaks original file formatting.

Technique with space is used because of intention to keep line-to-line equality
between base translation file and derived ones. Without this requirement it
may be omitted fully.

### Known bugs in base files

There are bugs which require manual editing in files after syncing:
- ~~double `general.js2023.survey_intro` keys in `surveys` file~~
- double `user_info.other_surveys.question` keys in `common` file
- ~~double `user_info.disability_status.question` keys in `common` file~~
- ~~double `charts.freeform_data` keys in `results` file~~
- `Winner:` value at wrong level in `surveys` file
- double `options.top_currently_missing_from_js.static_typing` keys in `state_of_js` file
- double `options.top_currently_missing_from_js.standard_library` keys in `state_of_js` file
- double `options.top_currently_missing_from_js.pipe_operator` keys in `state_of_js` file
- double `options.top_currently_missing_from_js.decorators` keys in `state_of_js` file

They [should be fixed](https://github.com/Devographics/locale-en-US/issues/34)
directly in base files by translators later.
