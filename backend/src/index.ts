/**
 * Required External Modules
 */
import database from './config/database';
import app from './app';

// Connect Database
database.sync({ force: true }).then(
  () => {
    // Server Activation
    app.listen(process.env.PORT, () => {
      console.log(`app listening on the port ${process.env.PORT}`);
    });
  },
  err => {
    console.log(err);
  },
);
