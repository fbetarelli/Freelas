CREATE TABLE users (
    codigo SERIAL PRIMARY KEY,  
    login VARCHAR(50) NOT NULL,  
    senha VARCHAR(255) NOT NULL  
);

CREATE TABLE clientes (
    codigo SERIAL PRIMARY KEY,  
    nome VARCHAR(50) NOT NULL,
    endereco VARCHAR(255), 
    contato VARCHAR(150),
	coduser INT REFERENCES users (codigo) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL
);

CREATE TABLE servicos (
	codigo SERIAL PRIMARY KEY,
	dataServico DATE,
	descr VARCHAR(150),
	pago BOOLEAN,
	valorTotal FLOAT,
	codcliente INT REFERENCES clientes (codigo) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL,
	coduser INT REFERENCES users (codigo) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL
);

CREATE TABLE pagamentos (
	codigo SERIAL PRIMARY KEY,
	metodo VARCHAR(50),
	dataPagamento DATE,
	valor FLOAT,
	parcela INT,
	codservico INT REFERENCES servicos (codigo) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL
);

CREATE TABLE materiais (
	codigo SERIAL PRIMARY KEY,
	descr VARCHAR(50),
	fornecedor VARCHAR(250),
	QTDE INT,
	valorUni FLOAT,
	codservico INT REFERENCES servicos (codigo) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL
);



select * from users;
select * from clientes;
select * from servicos;
select * from pagamentos;
select * from materiais;

drop table users;
drop table clientes;
drop table servicos;
drop table pagamentos;
drop table materiais;


