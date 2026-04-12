# FreelanceManager
## 🇧🇷 Português

Projeto Full-stack criado para prática: Um gereciador multicapacitado criado para trabalhadores freelance controlarem, organizarem e visualizarem seus clientes, serviços, pagamentos e mais.

## 🇺🇸 English

Full-stack practice project: An all-in one manager for freelance workers to track, organize and visualize their clients, jobs, payments and more.


## Preview

![Home](./assets/screenshots/page.png)

![Workflow](./assets/demo.gif)


Checkout the website [here!](https://freelas.up.railway.app)

## Features

* Intuitive and agile client, job, materials and payments registration for autonomous workers
* Profit calculations by job and for the last 30 days
* Search through previous clients or jobs with a simple query by name or description
* Complete responsive design for desktop or mobile users  

## Tech Stack

### Backend
* Node.js
* Express
* PostgreSQL

### Frontend
* EJS
* TailwindCSS

### Miscellaneous Libraries
* Helmet
* bcrypt
* connect-flash

## Architecture
### Layers
* Main data flow: 
```
Views -> Controller -> Service -> Repositories (DAO)
```
__Views__: The heart of the front-end, contains all EJS pages in the application, gathers every user input and returns their outputs.

__Controller__: Treats data sent through the front-end, sending them to the services layer after the appropriate validations and convertions, and rendering the appropriate pages with the returned information from the services in response. 

__Service__: Mainly responsible for the business logic in the application, and calls to the DAO objects through a custom DAO function, returning Data Transfer Objects to the controller's function.

__Repositories__: A collection of Data Acess Objects that perform the requested function, running direct queries in the specified database instanciated in the database pool class, being able to send objects or arrays resulted from the function back to the service class for processing.

### Database Diagram

![Diagram](./assets/dbDiagram.png)

## Getting Started
Firstly, make sure you have a postgreSQL database up and running and have  configured a .env file complete with the specified required variables in the provided .env.example file, then, open up an integrated terminal in the project's folder from your IDE, where you'll be able to run the following commands.   

The build process for running this software locally on your machine:

* Installing dependencies
```
npm i 
```

### There are two separate ways to run the app locally:
**First Option**: Builds the database and then runs the app *(recommended option for your first time running the program)*: 
* Start command:
```
npm run start
```
This command will run the necessary migrations for the application and then **run the production command automatically**, when you see the message: ``"Servidor rodando na porta: *PORT variable in the .env file*" `` then you can head on to your browser of choice and lookup ``localhost:`` with the provided port next to it. 

---

**Second Option**: Just builds tailwind and runs the server *(recommended option if you already have the database running with all the necessary tables)*: 
* Production command:
```
npm run prod
```
This command by itself will **not** run the necessary migrations for the application, but it will build tailwind and run the server on localhost just like the previous command. 

## Technical Decisions
In the engineering and development stage I came across some interesting questions, here are some of them and how they were answered:

#### Should I stick to the stack I'm most familiar with, or should I try something new e.g(different frameworks/libraries) with this project?

One of my main concerns with this project was that while this is mostly a portfolio/practice project, I still need it to be functional, secure and for it's behaviors to be predictable enough for me to maintain this without major problems. 

Since this software is also going to be used by a few of my peers for the foreseeable future, my decision to go with my most known technologies like EJS and Postgres, instead of a different stack I'm not familiar with that can provide possible advantages like utilizing React or SQLite, comes from a desire to keep a higher maintainabilty and support for this than to just try out something new and have another project I can put in my portfolio.

#### How is the responsive design a necessary implementation?

For one, I knew this was immediately a must have since the people that have notified me of their intent to use this application have expressed how they would mostly check the website out on their mobile phones.

That feedback is what mainly led me to design the whole UI with a mobile first approach, and then an adaptation for the desktop screens. 

And for two,  i'd never done a little higher scale software UI design like this, so I figured the process would be a very needed and interesting experience.      

## Challenges & Learnings

#### Design faults that led to a lot of refactoring: code repetition and logic

A lack of attention while creating the controllers and services of each class ended up in me writing and copying a bunch of replicated code across multiple controller and service files, there was just a lot of repeated unnecessary try catches, and logic that would've applied in typical .json returning apis, but that just didn't fit with this webservice.
 
The code included things like a success status attribute in every service function that returned true or false based on if any errors were catched in the DAO or itself, along with all the unnecessary repeated try catches in every service function, multiple repeated DAO CRUD calls that were identical, just changing the desired table and object passed to the function. 

Only after I was done with the main backend code I started to reread those parts of the system and notice the faults in my logic and code, that led me to a couple days of just refactoring the affected files.

#### The fixing part
The solution to fixing all the try catches was creating an async handler function that was responsible for handling any exceptions thrown by whatever the previous command was, and automatically rerouting the user to a custom error screen, then I could import that function to all my controllers, and safely remove all the try catches used in both the controllers and services, leading exceptions in any part of the code to be wrapped and centralized, complete with a custom error screen.

What I did to handle all the similar DAO calls was add another helper in the utils folder, that acted as a personalized function that would run the dao calls, given the DAO object, action, and the parameters of the query, complete with a toDTO parameter i could add for all the commands that required a return value, usually in the form of a DTO object or array generated from the query result, that way, i could avoid repetition by calling this function on most of my service DAO calls.    

Overall these errors just make me notice how unconscious decisions that seem small on the surface can lead to a bunch of lost time and efficency, that makes me want to be more cautious and reflect more on the design of my system through these decisions.