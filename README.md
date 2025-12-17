# Football Online Manager APIs

## How to start the app
### 1- run docker images required (mongoDB , redis) by using docker compose up while docker running in background
### 2- run in mongosh: 
rs.initiate({
  _id: "rs0",
  members: [{ _id: 0, host: "localhost:27017" }]
})
### in order to create replica to allow running transactions

### 3- run npm run start:dev to run the project (you can customize port and all env vars by adding env or directly in config.ts)
### 4- all APIs are documented on swagger it will be on url (http://localhost:3000/api/docs) and you can watch the jobs running on the bull board on (http://localhost:3000/admin/queues)

## Thank You
