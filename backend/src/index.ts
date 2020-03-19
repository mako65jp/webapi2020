/**
 * Required External Modules
 */
import app from './app';
import database from './config/database';

// Connect Database
database.sync({ force: true, alter: true }).then(
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
