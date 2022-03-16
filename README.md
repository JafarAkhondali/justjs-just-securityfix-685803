# Just

*Essential utilities for all your javascript proyects.*

![CI](https://github.com/justjs/just/actions/workflows/ci.yml/badge.svg) [![Coverage Status](https://coveralls.io/repos/github/justjs/just/badge.svg?branch=master)](https://coveralls.io/github/justjs/just?branch=master) [![npm version](https://badge.fury.io/js/%40just-js%2Fjust.svg)](https://badge.fury.io/js/%40just-js%2Fjust)

**JustJs** is a fully-tested and well-documented open-source library that collects heavily-used utilities for javascript environments. Visit [justjs.github.io](https://justjs.github.io/) to know more.

## Development

- Run ``` npm run dev ``` and wait for Jest to start.
- Run ``` npm run doc:dev ``` to check documentation or update the static website. *—The browser will automatically start and changes to the source code will update the documentation. Be mindful that it may take some time to automatically reload the website.*

## Testing

- Run ``` npm test ``` to run unit test on --ci mode.
- Run ``` npm run test:unit ``` to run unit tests.
- Run ``` npm run test:integration ``` to run integration tests.
- Run ``` npm run test:e2e ``` to run integrity tests.
- Run ``` npm run test:dev ``` to run jest on --watch & --coverage mode.
- Run ``` npm run test:jest ``` to run jest.
- Run ``` npm run test:coverage ``` to run ``` npm test ``` on --coverage mode.
- Run ``` npm run test:coverage:coveralls ``` to update coveralls info (internal use only).

## Linting

- Run ``` npm run lint ``` to run eslint.
- Run ``` npm run style ``` to run ``` npm run lint ``` on --fix mode.

## Releasing

- Run ``` npm run build ``` to build the distributed files under the `/dist` directory and generate its documentation under `/docs/public`.
- Run ``` npm run doc:deploy ``` to deploy the generated documentation to the [static website](https://github.com/justjs/justjs.github.io).

### Notes

Releases are done in the `releases/M.m` branch, where `M` is a major version, and `m` is the minor version.

Releasing and deployments are done automatically when a release tag (the one generated by ``` npm version ```) is pushed to this repository.

Releases are generated using the ``` npm run release $next-version ``` for now, *where ``` $next-version ``` is a valid version in the [semver 2.0 format](https://semver.org/spec/v2.0.0.html).*

## Documentation

This project publishes all documentation written in the source code to [justjs.github.io](https://justjs.github.io). *Just make sure you write valid [JSDOC](https://github.com/jsdoc/jsdoc) comments.*

All source code for the static website lives under `docs`, but only `docs/public` contains the generated content that will be pushed to [another repository](https://github.com/justjs/justjs.github.io), in order to be published on [justjs.github.io](https://justjs.github.io).

The following are a list of useful scripts:
- Run ``` npm run doc:dev ``` to watch for changes, build the website, and update the generated documentation continuously.
- Run ``` npm run doc v$some-version ``` to document ``` $some-version ``` (don't forget the "v" prefix).
- Run ``` npm run doc:test ``` to run end-to-end tests.
- Run ``` npm run doc:jsdoc ``` to run JSDOC.
- Run ``` npm run doc:jsdoc:dev ``` to watch for changes and update the generated documentation continuously. *Same as ``` npm run doc:dev ```, for now.*
- Run ``` npm run doc:minify ``` to minify the generated documentation.

## License

This project is under the [BSD 3-Clause License](LICENSE), unless otherwise stated.
