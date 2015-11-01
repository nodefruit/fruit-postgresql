var config = {};

if(process.env.HOST && process.env.DB && process.env.USER && process.env.PASS!=undefined) {
  config = {
      host                : process.env.HOST
    , database            : process.env.DB
    , user                : process.env.USER
    , password            : process.env.PASS
  }
} else {
  console.log(' Make sure to specify a new and empty database for test            ');
  console.log(' example :                                                         ');
  console.log(' HOST="localhost" DB="test" USER="root" PASS="123" npm test        ');
  throw new TypeError(' You need to specify database information as environment variables ');
}

module.exports = config;