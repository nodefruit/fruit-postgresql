[![Fruit][logo]][repo-link]

[![CI Buimd][build-image]][build-url]
[![Dependencied][dependencies-image]][dependencies-url]
[![experimental][stability-image]][stability-url]
[![MIT license][license-img]][license-url]
[![Gitter][gitter-img]][gitter-url]

### Introduction :

This is the postgresql adapter for the [fruit](http://npmjs.com/package/fruit) ORM, if you haven't take a look at its documentation yet, please make sure to do so.

### Installation :

```bash
  $ npm install fruit fruit-postgresql
```

### Connection options :

This is an example the options you need to pass to the fruit constructor:

```javascript
  {
      host                : 'host'
    , database            : 'db'
    , user                : 'user'
    , password            : '******'
    , multipleStatements  : true
  }
```

[logo]: https://github.com/nodefruit/fruit-postgresql/raw/master/pres/logo.png
[repo-link]: https://github.com/nodefruit/fruit-postgresql
[build-image]: https://api.travis-ci.org/nodefruit/fruit-postgresql.svg
[build-url]: https://github.com/nodefruit/fruit-postgresql
[stability-image]: https://img.shields.io/badge/stability-experimental-orange.svg
[stability-url]: https://github.com/nodefruit/fruit-mysql
[license-img]: https://img.shields.io/badge/license-MIT-green.svg
[license-url]: https://github.com/nodefruit/fruit-postgresql/blob/master/LICENSE
[dependencies-image]:https://david-dm.org/nodefruit/fruit-postgresql.svg
[dependencies-url]:https://npmjs.com/package/fruit-postgresql
[gitter-img]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]: https://gitter.im/nodefruit/fruit?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge