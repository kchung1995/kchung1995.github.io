# AGENTS.md

## Purpose

This repository contains a personal tech blog deployed with GitHub Pages.

Agents working in this repo should prioritize:
- Safe maintenance of the existing blog
- UX improvements that preserve content quality and readability
- Small, reversible theme and layout changes over broad rewrites
- Fast validation of blog behavior after edits

This is a Jekyll-based site with a Minimal Mistakes-derived structure and local customizations.

## Repository Overview

Key files and directories:

- `_config.yml`
  Main Jekyll site configuration, metadata, plugins, pagination, comments, analytics, author profile, and theme settings.

- `Gemfile`
  Ruby dependencies for local Jekyll/GitHub Pages development.

- `package.json`
  JavaScript build helpers for minifying theme JS into `assets/js/main.min.js`.

- `index.html`
  Homepage entry point. Uses the `home` layout.

- `_posts/`
  Blog posts. Posts use date-prefixed filenames and Markdown content.

- `_layouts/`
  Page and post layout templates.

- `_includes/`
  Shared partials used by layouts. This is a common place for UX and rendering changes.

- `assets/css/main.scss`
  Main stylesheet entry point and theme overrides.

- `assets/js/`
  Frontend JavaScript, including source files and minified output.

- `assets/images/`
  Blog images and post-specific images.

## How This Site Works

This repo is a GitHub Pages-compatible Jekyll blog.

Important characteristics:
- Jekyll configuration is defined in `_config.yml`
- Posts live in `_posts/`
- Shared rendering logic is mostly in `_layouts/` and `_includes/`
- Styling changes typically go through `assets/css/main.scss`
- JavaScript source is in `assets/js/_main.js` and related plugin files
- Minified JS output is committed as `assets/js/main.min.js`

Do not assume a modern app framework or component system. Most UX work here will be done through Jekyll templates, Liquid, SCSS, and content structure.

## Local Development

Use the existing Ruby/Jekyll workflow for local preview.

Typical setup:
- `bundle install`
- `bundle exec jekyll serve`

If JavaScript source files are edited, rebuild minified JS:
- `npm install`
- `npm run build:js`

Useful checks after changes:
- Local site starts successfully
- Homepage renders
- A post page renders
- Search, comments, pagination, and metadata still appear correctly if relevant to the change

## Working Style

When making changes:
- Prefer small, targeted edits
- Preserve existing site identity and writing tone
- Avoid broad theme rewrites unless explicitly requested
- Keep GitHub Pages compatibility in mind
- Assume the user values maintainability over cleverness

Before editing:
- Identify whether the task is content, layout, styling, config, or asset-related
- Check whether the change affects only one page or the entire site

After editing:
- Verify the affected pages locally when possible
- Mention any areas that were not validated

## Content Conventions

When creating or editing posts:
- Store posts in `_posts/`
- Use Jekyll-style date-prefixed filenames
- Keep front matter valid YAML
- Preserve existing tagging and category conventions unless asked to reorganize them
- Keep post formatting readable on both desktop and mobile
- Use descriptive alt text where appropriate
- Put post images in a post-specific folder under `assets/images/posts/` when possible

When reviewing front matter:
- Validate key names carefully
- Check that layout/category/tag/date fields are correct
- Confirm image references exist
- Watch for typos that silently break Jekyll behavior

If a post filename, slug, or front matter change would alter public URLs, treat it as a potentially user-visible breaking change and call it out.

## UX Improvement Principles

Optimize for real reading experience, not just appearance.

Priorities:
- Readability first
- Clear navigation and post discovery
- Good mobile experience
- Minimal clutter
- Fast scanning of lists and metadata
- Consistent typography and spacing
- Accessibility basics: heading structure, contrast, alt text, link clarity

Good UX changes in this repo usually include:
- Better homepage structure
- Cleaner post metadata presentation
- Improved spacing and typography
- Better archive/category/tag navigation
- More consistent image presentation
- Reduced friction for reading on mobile

Avoid:
- Introducing heavy dependencies for simple UI changes
- Reworking the entire theme without approval
- Making the homepage visually busier without improving discoverability
- Breaking established post layout conventions

## Theme and Template Rules

This site is based on a Minimal Mistakes-style structure with local overrides.

When changing templates:
- Prefer local overrides in `_layouts/`, `_includes/`, and `assets/css/main.scss`
- Keep changes consistent with the existing theme patterns unless the user asks for a redesign
- Be careful with shared includes because they can affect many pages at once
- Treat `_config.yml` changes as high-impact

When changing CSS:
- Prefer focused overrides over large cascades
- Preserve readable font sizing and code block presentation
- Check mobile layout impact
- Avoid one-off hacks unless clearly documented

When changing JS:
- Edit source files, not only minified output
- Rebuild `assets/js/main.min.js` after source changes
- Avoid adding JS for behavior that can be handled in templates or CSS

## High-Impact Files

Use extra caution when editing:
- `_config.yml`
- `_layouts/default.html`
- `_layouts/home.html`
- `_layouts/single.html`
- `_includes/head.html`
- `_includes/head/custom.html`
- `_includes/masthead.html`
- `_includes/sidebar.html`
- `_includes/archive-single.html`
- `assets/css/main.scss`
- `assets/js/_main.js`

These files can change behavior site-wide.

## Verification Checklist

For non-trivial changes, verify as many of these as possible:

- Site builds locally
- Homepage loads
- At least one post page loads
- Pagination still works
- Category/tag/archive pages still render if affected
- Search still appears if affected
- Comments still appear if affected
- No broken image paths
- No obvious layout issues on narrow screens
- No YAML or Liquid syntax errors

If something could not be verified, state that explicitly.

## Safe and Unsafe Changes

Usually safe:
- Editing post content
- Fixing front matter typos
- Adjusting spacing, typography, or small layout details
- Updating homepage or archive presentation in a focused way
- Improving accessibility text and metadata display

Potentially risky:
- Changing permalink behavior
- Renaming post files or changing dates
- Editing `_config.yml`
- Changing shared includes
- Touching analytics or comments configuration
- Modifying search behavior
- Replacing theme structure broadly
- Editing JS without rebuilding minified assets

## Common Task Playbooks

### Add a New Post

- Create a new file in `_posts/`
- Add valid front matter
- Add content and images
- Confirm links and image paths
- Preview locally

### Improve Homepage UX

- Check `index.html`, `_layouts/home.html`, and relevant includes
- Keep the reading flow simple
- Make recent posts easier to scan
- Verify mobile spacing and hierarchy

### Adjust Styling

- Prefer edits in `assets/css/main.scss`
- Check code blocks, headings, body text, links, and images
- Avoid theme-wide regressions

### Update Head and SEO Metadata

- Check `_config.yml` and `_includes/head/custom.html`
- Be conservative
- Do not remove verification or analytics settings unless requested

### Fix Rendering Issues

- Inspect front matter first
- Then inspect layout and include logic
- Then inspect CSS
- Verify whether the issue is site-wide or post-specific before editing

## Communication Expectations

When reporting work:
- State what changed
- State what was verified
- Call out any risky assumptions
- Mention any user-visible side effects such as URL or metadata changes

If a task suggests a larger redesign, propose it separately before implementing.

## Non-Goals

Unless explicitly requested, do not:
- Replatform the site
- Replace Jekyll with another framework
- Remove Minimal Mistakes structure wholesale
- Change site identity, title, author profile, analytics, or comment provider settings
- Perform a large visual redesign in one pass

## Notes for Future Agents

This repo is content-first. The goal is not to make it flashy; the goal is to make it easier and more pleasant to read, browse, and maintain.
