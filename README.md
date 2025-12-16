# Project Name: Vehicle Rental API : [https://carrentapi.vercel.app/](https://carrentapi.vercel.app/)

A robust backend RESTful API for a Vehicle Rental System, built with performance and type-safety in mind.

## 🛠️ Technologies Used

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Security:** bcrypt (Password Hashing)
- **Authentication:** JSON Web Token (JWT)

---

## ⚙️ Workflow Overview

1.  **Request Handling:** Client-side theke request Express.js router-e ase.
2.  **Authentication:** JWT middleware check kore user valid kina. Password-er khetre `bcrypt` hashing use kora hoyeche.
3.  **Business Logic:** Controllers request analyze kore database-er sathe communicate kore.
4.  **Data Layer:** PostgreSQL database-e structured format-e data store hoy.
5.  **Data Transformation:** Database output (like `NUMERIC` strings) ke runtime-e JSON format-e number hisebe transform kora hoy.

---

## 🚀 Features (CRUD Operations Example)

API-te **Vehicle Management**-er jonne nicher operations gulo exist kore:

| Operation         | Method   | Endpoint            | Description                             |
| :---------------- | :------- | :------------------ | :-------------------------------------- |
| **Create**        | `POST`   | `/api/vehicles`     | Add a new vehicle (Car, Bike, Van, SUV) |
| **Read**          | `GET`    | `/api/vehicles`     | Fetch all available vehicles            |
| **Read (Single)** | `GET`    | `/api/vehicles/:id` | Fetch details of a specific vehicle     |
| **Update**        | `PUT`    | `/api/vehicles/:id` | Update vehicle info or status           |
| **Delete**        | `DELETE` | `/api/vehicles/:id` | Remove a vehicle from the record        |

---

# Setup & Usage Instruction:

- Package Install:

  - npm init -y
  - npm i express pg bcrypt jsonwebtoken dotenv cors
  - npx tsc --init
  - npm i bcrypt
  - npm i -D typescript ts-node-dev @types/express @types/node @types/bcrypt @types/jsonwebtoken

  ### Live Demo: **API Link:** [https://carrentapi.vercel.app/](https://carrentapi.vercel.app/)
