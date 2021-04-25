# Vue 2 TypeScript Monorepo starter

Includes:
- Webapp built with Vue 2 (router, stylus)
- HTTP API server daemon (express)
- A library shared by the above
- All TypeScript
- Monorepo using Yarn 1.x, no Lerna
  (Nothing wrong with Yarn 2.x or Lerna, just this doesn't use it)
- Serve and live update on file changes

## First time

These tools are optional but very useful to install globally:

    yarn global add concurrently node-dev

Install all the dependencies:

    yarn install

VSCode and maybe other IDEs seem to need an initial build of libs:

    yarn libs
    yarn build-api  # or maybe this; not sure

## Build and run

You can build the shared libs, the API Daemon and Vue webapp in one line:

```
yarn serve
```

You can then edit source, save, and everything should rebuild and adjust on-the-fly.

For example, add a suffix to the common library 'timestamp' function:

```
export function timestamp(): string {
  return new Date().toISOString() + 'A' // <-- add the "A" just as a way to prove changes work rapidly
}
```

You can build and serve _just the API_ in one line like this:

```bash
# either this in the root dir:
yarn workspace daemon serve
```

or like this:

```bash
cd daemon && yarn serve
```

or, more explicitly:

```bash
cd daemon/
yarn serve
```

The API has a `GET` endpoint:

```bash
$ curl http://192.168.0.127:3001/
TypeScript at 2020-11-28T16:38:52.486Z
```

and a `POST` endpoint:

```bash
$ curl http://192.168.0.127:3001/api/hello -H 'Content-type: application/json' -d '{"foo":"bar"}'
{
  "ts": "2020-11-28T16:42:05.160Z",
  "received": {
    "foo": "bar"
  },
  "origin": {
    "hostname": "192.168.0.127",
    "ip": "::ffff:192.168.0.127"
  }
}
```

Note that the "Content-type" is important, or the remote end won't receive the JSON (at least,
not without extra work) and the 'received' field above will be blank.

## Build and run parts separately

In one terminal:

    (cd libs/foolib && yarn build --watch)

In another terminal:

    (cd daemon && yarn build --watch)

And another:

    # you may need "yarn global add node-dev" for this:
    node-dev dist/bin/daemon.js

And in the last terminal:

    (cd webapp && yarn serve)

## Adding and managing dependencies

To add a package to all workspces:

    # In the root dir of this repo...
    # The "-W" is the important bit:
    yarn add package-name-here -W

To add a package to a specific workspace (e.g. the 'daemon' area):

    yarn workspace daemon add package-name-here

The same operation, but a 'dev' package:

    yarn workspace daemon add package-name-here --dev # or '-D'

Update the 'daemon' local module to use the 'foolib' local module - note that
the specific version seems to e a requirement, which is weird. Not sure if it
can be avoided:

    yarn workspace daemon add foolib@0.1.0

Remember to check conflicts using 'syncpack':

    yarn check

## Reading

Simple, clear and useful:
https://dev.to/t7yang/typescript-yarn-workspace-monorepo-1pao

