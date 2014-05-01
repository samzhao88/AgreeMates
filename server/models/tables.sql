CREATE TABLE users 
  ( 
     id         VAR_CHAR(255) NOT NULL PRIMARY KEY, 
     first_name VAR_CHAR(255) NOT NULL, 
     last_name  VAR_CHAR(255) NOT NULL, 
     email      VAR_CHAR(255) NOT NULL, 
     phone      INT NOT NULL, 
  ); 

CREATE TABLE user_pays_payment 
  ( 
     user_id    VAR_CHAR(255), 
     payment_id VAR_CHAR(255), 
     amount     INT, 
     FOREIGN KEY(user_id) REFERENCES users, 
     FOREIGN KEY(payment_id) REFERENCES payments, 
  ); 

CREATE TABLE user_creates_bill 
  ( 
     user_id VAR_CHAR(255), 
     bill_id VAR_CHAR(255), 
     date    DATE, 
     FOREIGN KEY(user_id) REFERENCES users, 
     FOREIGN KEY(bill_id) REFERENCES bills, 
  ); 

CREATE TABLE user_creates_chore 
  ( 
     user_id  VAR_CHAR(255), 
     chore_id VAR_CHAR(255), 
     date     DATE, 
     FOREIGN KEY(user_id) REFERENCES users, 
     FOREIGN KEY(chore_id) REFERENCES chores, 
  ); 

CREATE TABLE user_assigned_chore 
  ( 
     user_id  VAR_CHAR(255), 
     chore_id VAR_CHAR(255), 
     FOREIGN KEY(user_id) REFERENCES users, 
     FOREIGN KEY(chore_id) REFERENCES chores, 
  ); 

CREATE TABLE user_occupies_apartment 
  ( 
     user_id      VAR_CHAR(255), 
     apartment_id VAR_CHAR(255), 
     FOREIGN KEY(user_id) REFERENCES users, 
     FOREIGN KEY(apartment_id) REFERENCES apartments, 
  ); 

CREATE TABLE user_creates_message 
  ( 
     user_id    VAR_CHAR(255), 
     message_id VAR_CHAR(255), 
     date       DATE, 
     FOREIGN KEY(user_id) REFERENCES users, 
     FOREIGN KEY(message_id) REFERENCES message, 
  ); 

CREATE TABLE user_creates_comment 
  ( 
     user_id    VAR_CHAR(255), 
     comment_id VAR_CHAR(255), 
     date       DATE, 
     FOREIGN KEY(user_id) REFERENCES users, 
     FOREIGN KEY(comment_id) REFERENCES comments, 
  ); 

CREATE TABLE apartments 
  ( 
     id      VAR_CHAR(255) NOT NULL PRIMARY KEY, 
     name    VAR_CHAR(255), 
     address VAR_CHAR(255) NOT NULL, 
  ); 

CREATE TABLE apartment_owns_bill 
  ( 
     apartment_id VAR_CHAR(255), 
     bill_id      VAR_CHAR(255), 
     FOREIGN KEY(apartment_id) REFERENCES apartments, 
     FOREIGN KEY(bill_id) REFERENCES bills, 
  ); 

CREATE TABLE apartment_owns_chore 
  ( 
     apartment_id VAR_CHAR(255), 
     chore_id     VAR_CHAR(255), 
     FOREIGN KEY(apartment_id) REFERENCES apartments, 
     FOREIGN KEY(chore_id) REFERENCES bills, 
  ); 

CREATE TABLE apartment_owns_message 
  ( 
     apartment_id VAR_CHAR(255), 
     message_id   VAR_CHAR(255), 
     FOREIGN KEY(apartment_id) REFERENCES apartments, 
     FOREIGN KEY(message_id) REFERENCES messages, 
  ); 

CREATE TABLE apartment_owns_supply 
  ( 
     apartment_id VAR_CHAR(255), 
     supply_id    VAR_CHAR(255), 
     FOREIGN KEY(apartment_id) REFERENCES apartments, 
     FOREIGN KEY(supply_id) REFERENCES supplies, 
  ); 

CREATE TABLE supplies 
  ( 
     id     VAR_CHAR(255) NOT NULL PRIMARY KEY, 
     name   VAR_CHAR(255), 
     status INT NOT NULL, 
  ); 

CREATE TABLE messages 
  ( 
     id      VAR_CHAR(255) NOT NULL PRIMARY KEY, 
     subject VAR_CHAR(255), 
     body    LONGTEXT, 
     date    DATE, 
  ); 

CREATE TABLE message_owns_comment 
  ( 
     comment_id_id VAR_CHAR(255), 
     message_id    VAR_CHAR(255), 
     FOREIGN KEY(comment_id) REFERENCES comments, 
     FOREIGN KEY(message_id) REFERENCES messages, 
  ); 

CREATE TABLE comments 
  ( 
     id   VAR_CHAR(255) NOT NULL PRIMARY KEY, 
     body LONGTEXT, 
     date DATE, 
  ); 

CREATE TABLE chores 
  ( 
     id            VAR_CHAR(255) NOT NULL PRIMARY KEY, 
     name          VAR_CHAR(255), 
     createdate    DATE, 
     duedate       DATE, 
     interval      INT, 
     completed     INT, 
     reocurring_id VAR_CHAR(255), 
  ); 

CREATE TABLE bills 
  ( 
     id            VAR_CHAR(255) NOT NULL PRIMARY KEY, 
     name          VAR_CHAR(255), 
     createdate    DATE, 
     duedate       DATE, 
     interval      INT, 
     paid          INT, 
     amount        INT, 
     reocurring_id VAR_CHAR(255), 
  ); 

CREATE TABLE payments 
  ( 
     id     VAR_CHAR(255) NOT NULL PRIMARY KEY, 
     paid   INT, 
     amount INT, 
  ); 