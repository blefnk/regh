# 🤭 regh • user-friendly unlimited github api access

[💖 GitHub Sponsors](https://github.com/sponsors/blefnk) — [💬 Discord](https://discord.gg/Pb8uKbwpsJ) — [📦 NPM](https://npmjs.com/package/@reliverse/regh) — [✨ Repo](https://github.com/reliverse/regh)

> regh is your new best friend for fast, anonymous, cache-powered GitHub API access — no tokens, no limits, no drama — just pure metadata bliss.

## Why regh?

- 🚀 **Practically Unlimited** — Read public GitHub data without worrying about rate limits.
- 😘 **Our friends are cool** — `regh` is `ungh` on steroids. `regh` extends `ungh` with a richer, smarter API.
- 🔗 **Seamless Compatibility** — Built to play nice with [GitHub REST API](https://docs.github.com/en/rest/using-the-rest-api/getting-started-with-the-rest-api?apiVersion=2022-11-28&tool=javascript) & [Octokit](https://github.com/octokit/octokit.js#readme).
- 🔮 **Caching** — Smart caching reduces GitHub API pressure, makes you (and GitHub) a little happier.
- 🦄 **Edge-First** — Uses serverless Vercel Edge runtime + Vercel KV (soon) + Next.js 15 caching.
- 💪 **More Power, More Safety** — Fully typed, with better GitHub REST API–inspired design.
- 🧩 **Minimal, Intuitive API** — No clutter. No config hell. Just clean endpoints.
- 🧬 **Anonymous by Default** — No API token? You're still good to go.
- ⚡ **Edge-Accelerated** — Lightning fast responses.
- 🌐 **Open & Transparent** — No hidden tricks. What you see is what you get.
- 📦 **Tiny Client (Coming Soon)** — NPM package for effortless integration.
- 🔐 **Personal Tokens (Coming Soon)** — Bring your own GitHub token for higher rate limits and private data access.
- ✅ **Watchers** — Get the real `subscribers_count` for each repository (when using `?details=1` query parameter).
- 📅 **Pagination** — Paginated responses support for some of the endpoints.

## API Endpoints

| Endpoint | Description |
|:---------|:------------|
| `/repos/{owner}/{name}` | Repo details (stars, forks, etc.) |
| `/repos/{owner}/{name}/contributors` | List contributors |
| `/repos/{owner}/{name}/files/{branch}` | Browse repo files |
| `/repos/{owner}/{name}/files/{branch}/{path}` | Fetch file content |
| `/repos/{owner}/{name}/readme` | Get README (HTML + Markdown) |
| `/repos/{owner}/{name}/releases` | List all releases |
| `/repos/{owner}/{name}/releases/latest` | Get the latest release |
| `/repos/{owner}/{name}/branches` | List branches |
| `/orgs/{org}` | Organization info |
| `/orgs/{org}/repos` | Org repositories |
| `/orgs/{org}/repos/{query}` | Org repos (+ queries support) |
| `/stars/{repos}` | Stars info (repos or orgs) |
| `/users/{username}` | User profile |
| `/users/{username}/repos` | User's repositories |
| `/users/{username}/repos/{query}` | User's repos (+ queries support) |
| `/users/find/{query}` | Find user by email or search |

<!-- `/repos/{owner}/{name}/files/{branch}/{path}` | Fetch file content (with `.md` auto-rendered as HTML) -->

## Query Parameters and Response Structure

### How Queries Work

- ✂️`per_page` (number): Limits the number of repositories returned per request. Default and max values are set by the server (see below).
- 📄`page` (number): Specifies which page of results to return. Default is 1. Use this to paginate through large lists of repositories.
- 🖍️`fields` (string, comma-separated): Selects only the specified fields in the response. Applies to both list and single repo endpoints.
- 🔍`details` (boolean): If truthy (e.g. `1`, `true`), fetches extra details for each repository, including the real `subscribers_count` (watchers). If falsy or omitted, `subscribers_count` will be `null` (for performance).

You can combine these parameters, for example: `/users/blefnk/repos?per_page=10&page=2&fields=id,full_name`

### Response Structure: Differences from unjs/ungh

#### `/users/[name]/repos` and `/orgs/[owner]/repos`

Unlike unjs/ungh, these endpoints return a paginated response with the following structure:

```json
{
  "page": 1,
  "per_page": 100, // 100 is the default value (100 is also the maximum value — because of GitHub API limit)
  "public_repos": 123, // total number of public repos for the user/org
  "repos": [
    // ...list of repositories...
  ]
}
```

- `page`: The current page number.
- `per_page`: The number of repositories per page.
- `public_repos`: The total number of public repositories for the user or organization (makes it easy to calculate total pages).
- `repos`: The array of repository objects (fields depend on your query).

#### `/users/[name]`

The user profile endpoint includes the total number of public repositories as well:

```json
{
  "user": {
    "id": "104720746",
    "login": "blefnk",
    "name": "Nazar Kornienko 🇺🇦/oss",
    "twitter_username": "blefnk",
    "avatar_url": "https://avatars.githubusercontent.com/u/104720746?v=4",
    "public_repos": 42
  }
}
```

This makes it easy for clients to display repository counts and paginate through user/org repositories efficiently.

## Development

```bash
git clone https://github.com/blefnk/regh
cd regh
bun i
bun dev
```

## Roadmap

- [x] **Public API** — Live and kicking.
- [x] **Core Endpoint Parity** — GitHub essentials, fully matched.
- [x] **Contributor DX Boost** — Better types, better vibes.
- [ ] **Vercel KV Caching** — Smarter, faster, even cooler.
- [ ] **Tiny NPM Client** — `@reliverse/regh` package coming soon.
- [ ] **Personal Tokens** — Plug in your own token for extra firepower.
- [ ] **Better Field Naming** — At the moment, regh mirrors GitHub REST API field names exactly (for Octokit compatibility). 🔜 In the future, a "pretty names" (`ungh`-like) mode will be added — giving you cleaner, friendlier fields if you want them.

## Usage Examples

### `/repos/{owner}/{name}`

GitHub repository information.

**Example:** <https://regh.reliverse.org/repos/blefnk/relivator>
<!-- http://localhost:3000/repos/blefnk/relivator -->

```json
{
  "repo": {
    "id": 677839173,
    "name": "relivator-nextjs-template",
    "full_name": "blefnk/relivator-nextjs-template",
    "description": "🏬 Relivator: Next.js 15 React 19 eCommerce Template",
    "created_at": "2023-08-12T20:07:56Z",
    "updated_at": "2025-04-28T06:56:32Z",
    "pushed_at": "2025-04-23T23:31:10Z",
    "stargazers_count": 1258,
    "subscribers_count": 28,
    "forks": 234,
    "default_branch": "main",
    "git_url": "git://github.com/blefnk/relivator-nextjs-template.git",
    "html_url": "https://github.com/blefnk/relivator-nextjs-template",
    "language": "TypeScript",
    "private": false,
    "open_issues_count": 2
  }
}
```

### `/repos/{owner}/{name}/contributors`

Get repository contributors.

**Example:** <https://regh.reliverse.org/repos/blefnk/awgh-awesome-github-projects/contributors>
<!-- http://localhost:3000/repos/blefnk/awgh-awesome-github-projects/contributors -->

```json
{
  "contributors": [
    {
      "id": 41898282,
      "login": "github-actions[bot]",
      "contributions": 170
    },
    {
      "id": 104720746,
      "login": "blefnk",
      "contributions": 3
    }
  ]
}
```

### `/repos/{owner}/{name}/files/{branch}`

<!-- TODO: implement rate limiting to prevent service abuse. -->

> ‼️ `/repos/<id>/files/<path>` endpoint, at the moment, redirects to original `raw.githubusercontent.com` endpoint. ‼️

Get repository files tree on specific branch.

**Example:** <https://regh.reliverse.org/repos/blefnk/awllm-awesome-cursor-rules/files/main>
<!-- http://localhost:3000/repos/blefnk/awllm-awesome-cursor-rules/files/main -->

```json
{
  "meta": {
    "sha": "eb2fdbc5ad0ae9aedeae09965e54ea6ad88dc715"
  },
  "files": [
    {
      "path": "000-cursor-rules.md",
      "mode": "100644",
      "sha": "5f5d0cecfa608802a5c0b71ece7c70ae5c5f76df",
      "size": 2915
    },
    {
      "path": "README.md",
      "mode": "100644",
      "sha": "6f3b7cde7477f15a4da3954d33c07fb3ef0fd798",
      "size": 584
    }
  ]
}
```

### `/repos/{owner}/{name}/files/{branch}/{...path}`

<!-- TODO: implement rate limiting to prevent service abuse. -->

> ‼️ `/repos/<id>/files/<path>` endpoint, at the moment, redirects to original `raw.githubusercontent.com` endpoint. ‼️

Get file contents from a repository. If path ends with `.md`, an additional `html` field with rendered markup will be appended.

**Example:** <https://regh.reliverse.org/repos/reliverse/cli/files/main/README.md>
<!-- http://localhost:3000/repos/reliverse/cli/files/main/README.md -->

```json
{
  "meta": {
    "url": "https://raw.githubusercontent.com/reliverse/cli/main/README.md"
  },
  "file": {
    "contents": "...",
    "html": "..."
  }
}
```

**Or, 404 (_wrong branch_ OR repo does not exist)**: <https://regh.reliverse.org/repos/rick-astley/never-gonna-give-you-up/files/main/README.md>
<!-- http://localhost:3000/repos/rick-astley/never-gonna-give-you-up/files/main/README.md -->

_Correct branch name_: <https://regh.reliverse.org/repos/rick-astley/never-gonna-give-you-up/files/master/README.md>
<!-- http://localhost:3000/repos/rick-astley/never-gonna-give-you-up/files/master/README.md -->

```json
{
  "error": "File not found",
  "message": "The file 'README.md' was not found in rick-astley/never-gonna-give-you-up repository at branch 'main'"
}
```

### `/repos/{owner}/{name}/readme`

Get repository readme file on main branch (not cached)

**Example:** <https://regh.reliverse.org/repos/reliverse/rempts/readme>
<!-- http://localhost:3000/repos/reliverse/rempts/readme -->

```json
{
  "markdown": "# @reliverse/rempts\n\n[💖 GitHub Sponsors](https://github.com/sponsors/blefnk)...",
  "html": "<h1 dir=\"auto\">@reliverse/rempts</h1>\n<p dir=\"auto\"><a href=\"https://github.com/sponsors/blefnk\">💖 GitHub Sponsors</a>..."
}
```

### `/repos/{owner}/{name}/releases`

Get repository releases.

**Example:** <https://regh.reliverse.org/repos/vercel/next.js/releases>
<!-- http://localhost:3000/repos/vercel/next.js/releases -->

```json
{
  "releases": [
    {
      "id": 213741005,
      "tag": "v15.4.0-canary.0",
      "author": "vercel-release-bot",
      "name": "v15.4.0-canary.0",
      "draft": false,
      "prerelease": true,
      "created_at": "2025-04-21T18:35:00Z",
      "published_at": "2025-04-21T18:42:18Z",
      "markdown": "....",
      "html": "...",
      "assets": []
    }
  ]
}
```

### `/repos/{owner}/{name}/releases/latest`

Get latest repository release.

**Example:** <https://regh.reliverse.org/repos/vercel/next.js/releases/latest>
<!-- http://localhost:3000/repos/vercel/next.js/releases/latest -->

```json
{
  "release": {
    "id": 213148622,
    "tag": "v15.3.1",
    "author": "huozhi",
    "name": "v15.3.1",
    "draft": false,
    "prerelease": false,
    "created_at": "2025-04-17T15:13:18Z",
    "published_at": "2025-04-17T16:26:48Z",
    "markdown": "...",
    "html": "...",
    "assets": []
  }
}
```

### `/repos/{owner}/{name}/branches`

Get all the branches of a repository

**Example:** <https://regh.reliverse.org/repos/zen-browser/desktop/branches>
<!-- http://localhost:3000/repos/zen-browser/desktop/branches -->

```json
{
  "branches": [
    {
      "name": "dev",
      "commit": {
        "sha": "2942ab3c08737810cbcaf7f3f07a455d4f0da6de",
        "url": "https://api.github.com/repos/zen-browser/desktop/commits/2942ab3c08737810cbcaf7f3f07a455d4f0da6de"
      },
      "protected": true
    },
    {
      "name": "new-gradient-animation",
      "commit": {
        "sha": "2c7937d6bcdd422c0a662d2f4fc91bd6ba1605bd",
        "url": "https://api.github.com/repos/zen-browser/desktop/commits/2c7937d6bcdd422c0a662d2f4fc91bd6ba1605bd"
      },
      "protected": false
    }
  ]
}
```

### `/orgs/{owner}`

GitHub organization information.

_Unlike unjs/ungh, displays the total number of public repositories for the organization._

**Example:** <https://regh.reliverse.org/orgs/reliverse>
<!-- http://localhost:3000/orgs/reliverse -->

```json
{
  "org": {
    "id": 148073080,
    "name": "reliverse",
    "description": "reliverse simplifies developers lives. one ecosystem. endless tools."
  }
}
```

### `/orgs/{owner}/repos`

**Bonus features**: 📅`pagination`, 🖍️`fields`, 🔍`details`.

GitHub organization repositories overview.

**Example:**

- <https://regh.reliverse.org/orgs/reliverse/repos?page=1> <!-- http://localhost:3000/orgs/reliverse/repos?page=1 -->
- <https://regh.reliverse.org/orgs/reliverse/repos?details=1&page=1&details=1&per_page=10&fields=id,full_name,subscribers_count> <!-- http://localhost:3000/orgs/reliverse/repos?details=1&page=1&details=1&per_page=10&fields=id,full_name,subscribers_count -->

```json
{
  "repos": [
    {
      "id": 680246346,
      "name": "rse",
      "full_name": "reliverse/rse",
      "description": "🏯 rse (prev. @reliverse/cli) is a JS/TS, e.g. next.js, app creator inside your terminal.",
      "created_at": "2023-08-18T17:50:08Z",
      "updated_at": "2025-05-03T21:47:48Z",
      "pushed_at": "2025-03-28T22:53:03Z",
      "stargazers_count": 115,
      "subscribers_count": null,
      "forks": 7,
      "default_branch": "main",
      "git_url": "git://github.com/reliverse/rse.git",
      "html_url": "https://github.com/reliverse/rse",
      "language": "TypeScript",
      "private": false,
      "open_issues_count": 0
    }
  ]
}
```

### `/stars/{repos}`

Get star information for one or more repositories or organizations.

Multiple items can be separated by either `,` or `+` or space. Each item can be either `{owner}/{org}` to specify one repository or `{owner}/*` to specify all organization repositories.

**Example:**

- <https://regh.reliverse.org/stars/facebook/react,vercel/next.js> <!-- http://localhost:3000/stars/facebook/react,vercel/next.js -->
- <https://regh.reliverse.org/stars/reliverse/*+blefnk/*> <!-- http://localhost:3000/stars/reliverse/*+blefnk/* -->

```json
{
  "totalStars": 366791,
  "stars": {
    "facebook/react": 235187,
    "vercel/next.js": 131604
  }
}
```

### `/users/{username}`

Find one github user by username.

_Unlike unjs/ungh, displays the total number of public repositories for the user._

**Example:** <https://regh.reliverse.org/users/blefnk>
<!-- http://localhost:3000/users/blefnk -->

```json
{
  "user": {
    "id": 104720746,
    "login": "blefnk",
    "name": "Nazar Kornienko 🇺🇦/oss",
    "twitter_username": "blefnk",
    "avatar_url": "https://avatars.githubusercontent.com/u/104720746?v=4"
  }
}
```

### `/users/{username}/repos`

**Bonus features**: 📅`pagination`, 🖍️`fields`, 🔍`details`.

Get user repositories.

**Example:**

- <https://regh.reliverse.org/users/blefnk/repos?page=3> <!-- http://localhost:3000/users/blefnk/repos?page=3 -->
- <https://regh.reliverse.org/users/blefnk/repos?details=1&page=3&per_page=10&fields=id,full_name,subscribers_count> <!-- http://localhost:3000/users/blefnk/repos?details=1&page=3&per_page=10&fields=id,full_name,subscribers_count -->

```json
{
  "repos": [
    {
      "id": 899538896,
      "name": "versator-nextjs-template",
      "full_name": "blefnk/versator-nextjs-template",
      "description": "🏪 Versator: Next.js 15 React 19 eCommerce Template",
      "created_at": "2024-12-06T13:28:45Z",
      "updated_at": "2025-04-21T06:03:04Z",
      "pushed_at": "2025-04-24T17:20:05Z",
      "stargazers_count": 15,
      "subscribers_count": null,
      "forks": 4,
      "default_branch": "main",
      "git_url": "git://github.com/blefnk/versator-nextjs-template.git",
      "html_url": "https://github.com/blefnk/versator-nextjs-template",
      "language": "TypeScript",
      "private": false,
      "open_issues_count": 1
    }
  ]
}
```

### `/users/find/{query}`

Find one github user by email or other query.

_Unlike unjs/ungh, regh has support for multiple queries separated by `+` or `,`._

**Example:** <https://regh.reliverse.org/users/find/blefnk@gmail.com+pooya@pi0.io>
<!-- http://localhost:3000/users/find/blefnk@gmail.com+pooya@pi0.io -->

```json
{
  "users": [
    {
      "id": 104720746,
      "login": "blefnk",
      "name": "Nazar Kornienko 🇺🇦/oss",
      "twitter_username": "blefnk",
      "avatar_url": "https://avatars.githubusercontent.com/u/104720746?v=4",
      "public_repos": 242
    },
    {
      "id": 5158436,
      "login": "pi0",
      "name": "Pooya Parsa",
      "twitter_username": "_pi0_",
      "avatar_url": "https://avatars.githubusercontent.com/u/5158436?v=4",
      "public_repos": 379
    }
  ]
}
```

## Contributing

First, run the development server:

```bash
# bun 
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/route.ts`. The page auto-updates as you edit the file.

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### API Routes

For more details, see [route.js file convention](https://nextjs.org/docs/app/api-reference/file-conventions/route).

## Shoutouts 😘

Huge thank you and respect to this gem:

- [ungh](https://github.com/unjs/ungh) ([donate](https://github.com/sponsors/pi0)) — the original project that sparked the idea behind `regh`.

## Stand with Ukraine

- 💙 Help fund drones, medkits, and victory.
- 💛 Every dollar helps stop [russia's war crimes](https://war.ukraine.ua/russia-war-crimes) and saves lives.
- 👉 [Donate now](https://u24.gov.ua), it matters.

## Stand with Reliverse

- ⭐ [Star the repo](https://github.com/blefnk/regh) to help Reliverse community grow.
- 🦄 Follow this project's author, [Nazar Kornienko](https://github.com/blefnk) & [Reliverse](https://github.com/reliverse), to get updates about new projects.
- 💖 [Become a sponsor](https://github.com/sponsors/blefnk) and power the next wave of tools that _just feel right_.
- 🧑‍🚀 Every bit of support helps keep the dream alive: dev tools that don't suck.

> Built with love. Fueled by purpose. Running on caffeine.

## License

2025 [MIT](LICENSE) © [Nazar Kornienko (blefnk)](https://github.com/blefnk) & [Reliverse](https://github.com/reliverse)
