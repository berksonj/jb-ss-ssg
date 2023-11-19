# JB-SS-SSG

JB's Super Simple Static Site Generator.

Uses SASS and Nunjucks

## Develpoment

**Requirements**:

- node v20.0.0

**Install deps:**

```bash
npm install
```

**Install [pre-commit](https://pre-commit.com/) hooks:**

```bash
pre-commit install --install-hooks
```

**Build site**:

```bash
npm run build
```

**Watch for changes**:

```bash
npm run watch
```

**Run dev server**:

```bash
npm run serve
```

### Large Files

For large files, use [GitLFS](https://git-lfs.com/).

**TODO: Doesn't work with DigitalOcean App Platform Static Site deployments yet.**

## Deployment/Hosting

See [HOSTING.md](./HOSTING.md) for guides on hosting and automatic deployments on AWS.

Or,

[![Deploy to DO](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/berksonj/jb-ss-ssg/tree/master)



## To Dos

- Is there a clean way to use GitLFS with DO's App Platform Static Site hosting?
