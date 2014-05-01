CREATE TABLE users 
  ( 
     id           SERIAL PRIMARY KEY, 
     first_name   VAR_CHAR(255) NOT NULL, 
     last_name    VAR_CHAR(255) NOT NULL, 
     email        VAR_CHAR(255) NOT NULL, 
     phone        INT NOT NULL, 
     apartment_id SERIAL, 
     FOREIGN KEY(apartment_id) REFERENCES apartments, 
  ); 

CREATE TABLE users_chores 
  ( 
     user_id  SERIAL, 
     chore_id SERIAL, 
     FOREIGN KEY(user_id) REFERENCES users, 
     FOREIGN KEY(chore_id) REFERENCES chores, 
  ); 

CREATE TABLE apartments 
  ( 
     id      SERIAL PRIMARY KEY, 
     name    VAR_CHAR(255), 
     address VAR_CHAR(255) NOT NULL, 
  ); 

CREATE TABLE supplies 
  ( 
     id           SERIAL PRIMARY KEY, 
     apartment_id SERIAL, 
     name         VAR_CHAR(255), 
     status       SMALLINT, 
     FOREIGN KEY(apartment_id) REFERENCES apartment, 
  ); 

CREATE TABLE messages 
  ( 
     id           SERIAL PRIMARY KEY, 
     subject      VAR_CHAR(255), 
     body         LONGTEXT, 
     date         DATE, 
     user_id      SERIAL, 
     apartment_id SERIAL, 
     FOREIGN KEY(user_id) REFERENCES users, 
     FOREIGN KEY(apartment_id) REFERENCES apartments, 
  ); 

CREATE TABLE comments 
  ( 
     id         SERIAL PRIMARY KEY, 
     message_id SERIAL, 
     body       LONGTEXT, 
     date       DATE, 
     user_id    SERIAL, 
     message_id SERIAL, 
     FOREIGN KEY(user_id) REFERENCES users, 
     FOREIGN KEY(message_id) REFERENCES messages, 
  ); 

CREATE TABLE chores 
  ( 
     id            SERIAL PRIMARY KEY, 
     name          VAR_CHAR(255), 
     createdate    DATE, 
     duedate       DATE, 
     interval      INT, 
     completed     BOOLEAN, 
     reocurring_id SERIAL, 
     user_id       SERIAL, 
     apartment_id  SERIAL, 
     FOREIGN KEY(user_id) REFERENCES users, 
     FOREIGN KEY(apartment_id) REFERENCES apartments, 
  ); 

CREATE TABLE bills 
  ( 
     id            SERIAL PRIMARY KEY, 
     name          VAR_CHAR(255), 
     createdate    DATE, 
     duedate       DATE, 
     interval      INT, 
     paid          BOOLEAN, 
     amount        DECIMAL, 
     reocurring_id SERIAL, 
     user_id       SERIAL, 
     apartment_id  SERIAL, 
     FOREIGN KEY(user_id) REFERENCES users, 
     FOREIGN KEY(apartment_id) REFERENCES apartments, 
  ); 

CREATE TABLE payments 
  ( 
     id           SERIAL PRIMARY KEY, 
     paid         BOOLEAN, 
     amount       DECIMAL, 
     user_id      SERIAL, 
     apartment_id SERIAL, 
     FOREIGN KEY(user_id) REFERENCES users, 
     FOREIGN KEY(bill_id) REFERENCES bills, 
  ); 