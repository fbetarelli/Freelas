CREATE TABLE users (
    id SERIAL PRIMARY KEY,  
    username VARCHAR(50) NOT NULL,  
    login VARCHAR(50) NOT NULL,  
    hashpassword VARCHAR(100) NOT NULL  
);

CREATE TABLE clients (
    id SERIAL PRIMARY KEY,  
    name VARCHAR(50) NOT NULL,
    address VARCHAR(255), 
    contact VARCHAR(150),
	dateModified TIMESTAMP,
	userId INT REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL
);

CREATE TABLE jobs (
	id SERIAL PRIMARY KEY,
	jobDate DATE,
	descr VARCHAR(150),
	payed BOOLEAN,
	totalValue FLOAT,
	clientId INT REFERENCES clients (id) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL,
	userId INT REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL
);



CREATE TABLE payments (
	id SERIAL PRIMARY KEY,
	method VARCHAR(50),
	paymentDate DATE,
	value FLOAT,
	installment INT,
	jobId INT REFERENCES jobs (id) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL
);

CREATE TABLE materials (
	id SERIAL PRIMARY KEY,
	descr VARCHAR(50),
	supplier VARCHAR(250),
	qnt INT,
	unitaryVal FLOAT,
	jobId INT REFERENCES jobs (id) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL
);

SELECT * FROM jobs WHERE userId=1 ORDER BY jobDate LIMIT 5

select * from users;
select * from clients;
select * from jobs;
select * from payments;

SELECT * FROM payments WHERE jobId=21 ORDER BY paymentDate

SELECT SUM(materials.unitaryVal*qnt)
FROM materials
JOIN jobs ON materials.jobId = jobs.id
WHERE jobs.userId = 1 AND jobs.jobDate >= CURRENT_DATE - INTERVAL '1 month'

select * from materials;




INSERT INTO clients(name,address,contact,userID) VALUES ('nome','endereco','contato','2') RETURNING 1

SELECT * FROM clients WHERE userId=1

drop table materials;
drop table payments;
drop table jobs;
drop table clients;
drop table users;






