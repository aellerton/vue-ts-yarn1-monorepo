# Vue 2 TypeScript Monorepo starter

Includes:
- Webapp built with Vue 2 (router, stylus)
- HTTP API server daemon (express)
- A library shared by the above
- All TypeScript
- Monorepo using Yarn 1.x, no Lerna
  (Nothing wrong with Yarn 2.x or Lerna, just this doesn't use it)
- Serve and live update on file changes


## Build and run

Install dependencies:

    yarn install

Build the libs (though not completely sure why this is necessary):

    yarn libs

Run the service:

    yarn svc serve

Serve the webapp:

    yarn app serve

Or run server and app in one command:

    yarn serve

You can then edit source, save, and everything should rebuild and adjust on-the-fly.


## Build for production

All builds go to the dist folder.

    yarn svc dist
    yarn app dist


# Test

You can test an _individual part of the repo_ in several ways.

The shortest way:

    yarn svc test  

This is the same but shorter than:

    yarn workspace svc test

Or if you prefer:

    cd svc
    yarn test


# Experiment

For example, add a suffix to the common library 'timestamp' function:

```
export function timestamp(): string {
  return new Date().toISOString() + 'A' // <-- add the "A" just as a way to prove changes work rapidly
}
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


## Adding and managing dependencies

To add a package to all workspaces:

    # In the root dir of this repo...
    # The "-W" is the important bit:
    yarn add package-name-here -W

To add a package to a specific workspace, e.g. to the service:

    yarn workspace svc add package-name-here

The same operation, but a 'dev' package:

    yarn workspace daemon add package-name-here -D  # or --dev

x Update the 'daemon' local module to use the 'foolib' local module - note that
x the specific version seems to e a requirement, which is weird. Not sure if it
x can be avoided:

    NEED? $ yarn workspace daemon add foolib@0.1.0

Remember to check conflicts using 'syncpack':

    yarn check


## Reading

Simple, clear and useful:
https://dev.to/t7yang/typescript-yarn-workspace-monorepo-1pao

