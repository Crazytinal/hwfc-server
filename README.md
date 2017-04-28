# koa2 boilerplate

## Feature

- enable ES6/7 's feature, such as async/await
- hot reloading using nodemon
- logging

## Notes

```bash
$ npm install # install dependence
$ npm run dev # development mode, using dev.env.js as configuration
$ npm run build # compile the code under the `src` directory using babel
$ npm run serve # run the compiled code, using prod.env.js as configuration
```

### model

configure the database model under the `models` directory

models would be automatically loaded

```javascript
export default {
  name: String,
};
```

## Directory structure

```
.
├── README.md
├── .babelrc
├── .eslintrc
├── .gitignore
├── logs                    # log files
│   ├── debug-xx-xx.log
│   └── error-xx-xx.log
├── package.json
├── server                  # compiled code
│   └── *
├── src
│   ├── config              # configuration
│   │   ├── dev.env.js
│   │   ├── index.js
│   │   └── prod.env.js
│   ├── controllers         # request handler
│   │   └── user.js
│   ├── index.js            # entrance
│   ├── models              # database models
│   │   ├── index.js        # load models
│   │   └── user.js
│   ├── service             # database service
│   │   └── user.js
│   └── utils               # utility
│       └── logger.js
└── test                    # mocha test
    └── test.js
```