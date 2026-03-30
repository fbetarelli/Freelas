CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  
    username VARCHAR(50) NOT NULL,  
    login VARCHAR(50) NOT NULL,  
    hashpassword VARCHAR(100) NOT NULL  
);

CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    address VARCHAR(255), 
    contact VARCHAR(150),
	dateModified TIMESTAMP,
	userId UUID REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL
);

CREATE TABLE jobs (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	jobDate DATE,
	descr VARCHAR(150),
	payed BOOLEAN,
	totalValue FLOAT,
	clientId UUID REFERENCES clients (id) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL,
	userId UUID REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL
);



CREATE TABLE payments (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	method VARCHAR(50),
	paymentDate DATE,
	value FLOAT,
	installment INT,
	jobId UUID REFERENCES jobs (id) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL
);

CREATE TABLE materials (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	descr VARCHAR(50),
	supplier VARCHAR(250),
	qnt INT,
	unitaryVal FLOAT,
	jobId UUID REFERENCES jobs (id) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL
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

SELECT * FROM clients JOIN jobs ON clients.id = jobs.clientId  ORDER BY jobDate DESC LIMIT 5

SELECT * FROM clients JOIN (SELECT clientId, MAX(jobDate)
FROM jobs
GROUP BY clientId)
SELECT clientId, MAX(jobDate)
FROM jobs
GROUP BY clientId

INSERT INTO clients(name,address,contact,userID) VALUES ('nome','endereco','contato','2') RETURNING 1

SELECT * FROM clients WHERE userId=1

drop table materials;
drop table payments;
drop table jobs;
drop table clients;
drop table users;






