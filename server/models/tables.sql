CREATE TABLE users 
  ( 
     id           SERIAL PRIMARY KEY,
	 google_id    VARCHAR(21),
	 facebook_id  VARCHAR(21),
     first_name   VARCHAR(255) NOT NULL, 
     last_name    VARCHAR(255) NOT NULL, 
     email        VARCHAR(255) NOT NULL, 
     phone        INT NOT NULL, 
     apartment_id SERIAL, 
     FOREIGN KEY(apartment_id) REFERENCES apartments
  ); 

CREATE TABLE users_chores 
  ( 
     user_id  SERIAL, 
     chore_id SERIAL, 
     FOREIGN KEY(user_id) REFERENCES users, 
     FOREIGN KEY(chore_id) REFERENCES chores
  ); 

CREATE TABLE apartments 
  ( 
     id      SERIAL PRIMARY KEY, 
     name    VARCHAR(255), 
     address VARCHAR(255) NOT NULL
  ); 

CREATE TABLE supplies 
  ( 
     id           SERIAL PRIMARY KEY, 
     apartment_id SERIAL, 
     name         VARCHAR(255), 
     status       SMALLINT, 
     FOREIGN KEY(apartment_id) REFERENCES apartments
  ); 

CREATE TABLE messages 
  ( 
     id           SERIAL PRIMARY KEY, 
     subject      VARCHAR(255), 
     body         TEXT, 
     date         DATE, 
     user_id      SERIAL, 
     apartment_id SERIAL, 
     FOREIGN KEY(user_id) REFERENCES users, 
     FOREIGN KEY(apartment_id) REFERENCES apartments
  ); 

CREATE TABLE comments 
  ( 
     id         SERIAL PRIMARY KEY, 
     body       TEXT, 
     date       DATE, 
     user_id    SERIAL, 
     message_id SERIAL, 
     FOREIGN KEY(user_id) REFERENCES users, 
     FOREIGN KEY(message_id) REFERENCES messages
  ); 

CREATE TABLE chores 
  ( 
     id            SERIAL PRIMARY KEY, 
     name          VARCHAR(255), 
     createdate    DATE, 
     duedate       DATE, 
     interval      INT, 
     completed     BOOLEAN, 
     reocurring_id SERIAL, 
     user_id       SERIAL, 
     apartment_id  SERIAL, 
     FOREIGN KEY(user_id) REFERENCES users, 
     FOREIGN KEY(apartment_id) REFERENCES apartments
  ); 

CREATE TABLE bills 
  ( 
     id            SERIAL PRIMARY KEY, 
     name          VARCHAR(255), 
     createdate    DATE, 
     duedate       DATE, 
     interval      INT, 
     paid          BOOLEAN, 
     amount        DECIMAL, 
     reocurring_id SERIAL, 
     user_id       SERIAL, 
     apartment_id  SERIAL, 
     FOREIGN KEY(user_id) REFERENCES users, 
     FOREIGN KEY(apartment_id) REFERENCES apartments
  ); 

CREATE TABLE payments 
  ( 
     id           SERIAL PRIMARY KEY, 
     paid         BOOLEAN, 
     amount       DECIMAL, 
     user_id      SERIAL, 
     bill_id SERIAL, 
     FOREIGN KEY(user_id) REFERENCES users, 
     FOREIGN KEY(bill_id) REFERENCES bills
  ); 