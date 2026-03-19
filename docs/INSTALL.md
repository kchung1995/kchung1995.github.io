# Install and Run Locally

This blog is a Jekyll site intended to stay compatible with GitHub Pages.

The local development flow is primarily Ruby-based:
- Ruby installs the Jekyll and GitHub Pages dependencies
- Bundler runs the local site
- Node.js is optional and is only needed when rebuilding the minified JavaScript bundle

## 1. Prerequisites

### Required

- Ruby
- RubyGems
- Bundler

### Optional

- Node.js
- npm

Node is only required if you change files under `assets/js/` and need to rebuild `assets/js/main.min.js`.

## 2. Versions and Compatibility

This repository currently uses:
- `github-pages` from `Gemfile`
- `bundler 2.4.18` from `Gemfile.lock`
- `jekyll 3.9.3` through the `github-pages` gem

If `bundle` fails with a Bundler version error, install the version recorded in `Gemfile.lock`:

```bash
gem install bundler:2.4.18
```

## 3. First-Time Setup

From the repository root, install the Ruby dependencies:

```bash
bundle install
```

If you also plan to rebuild frontend JavaScript, install the Node dependencies:

```bash
npm install
```

## 4. Run the Blog Locally

Start the Jekyll development server:

```bash
bundle exec jekyll serve
```

By default, Jekyll will print a local address such as:

```text
http://127.0.0.1:4000/
```

Open that URL in your browser to preview the blog.

Jekyll watches for most file changes automatically. If you change `_config.yml`, stop the server and start it again because config changes are not always reloaded automatically.

## 5. Useful Commands

Serve with drafts:

```bash
bundle exec jekyll serve --drafts
```

Clean generated artifacts if the local build behaves strangely:

```bash
bundle exec jekyll clean
```

Rebuild and serve again:

```bash
bundle exec jekyll serve
```

## 6. Rebuild JavaScript Assets

This repository contains source JavaScript files and a committed minified bundle:
- source: `assets/js/_main.js` and related files
- output: `assets/js/main.min.js`

If you change JavaScript source files, rebuild the minified bundle:

```bash
npm run build:js
```

If you do not modify JavaScript, you usually do not need Node.js or npm.

## 7. Typical Local Workflow

1. Install dependencies once:

```bash
bundle install
```

2. Start the local server:

```bash
bundle exec jekyll serve
```

3. Edit posts, layouts, includes, or styles.

4. If you changed JavaScript source files, rebuild them:

```bash
npm run build:js
```

5. Refresh the browser and confirm the page renders as expected.

## 8. Common Problems

### Bundler version mismatch

Symptom:

```text
Could not find 'bundler (2.4.18)' required by your Gemfile.lock
```

Fix:

```bash
gem install bundler:2.4.18
```

Then run:

```bash
bundle install
```

### `bundle` command exists, but dependencies still fail

Try:

```bash
bundle install
```

If needed, explicitly use the matching Bundler version:

```bash
bundle _2.4.18_ install
bundle _2.4.18_ exec jekyll serve
```

### Node is not installed

Symptom:

```text
node: command not found
```

This does not block normal Jekyll development unless you need to rebuild `assets/js/main.min.js`.

If you need the JS build, install Node.js first, then run:

```bash
npm install
npm run build:js
```

### Native gem install issues on macOS

Some gems used by GitHub Pages may need Xcode Command Line Tools.

If gem installation fails while building native extensions, install Apple command line tools:

```bash
xcode-select --install
```

Then rerun:

```bash
bundle install
```

### Port 4000 is already in use

Run Jekyll on another port:

```bash
bundle exec jekyll serve --port 4001
```

## 9. Notes

- This repo does not currently declare a pinned Ruby version in `.ruby-version`.
- The local machine used during documentation had `ruby 2.6.10` available.
- The same machine did not have Node.js installed.

If you want stronger environment consistency later, add a `.ruby-version` file and document the preferred Ruby installation method such as `rbenv`, `mise`, or `asdf`.
