Backend database setup

1) Use MongoDB Atlas (recommended)
- Create a free cluster at https://www.mongodb.com/cloud/atlas
- Create a database user (username/password) and allow your IP (or 0.0.0.0/0 for dev)
- Get the connection string (replace <password> and DB name)
- Save it to a `.env` in the `backend` folder as:

```
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.example.mongodb.net/mydb?retryWrites=true&w=majority
```

Then start the backend:

```powershell
cd "D:/Shopping cart application/backend"
npm start
```

2) Run local MongoDB (alternative)
- Option A: Docker (recommended if you have Docker installed)

```powershell
docker run -d -p 27017:27017 --name mongo mongo:6
```

- Option B: Install MongoDB Community Server on Windows (https://www.mongodb.com/try/download/community)

After starting local Mongo, you can use the example fallback URI:

```
MONGO_URI=mongodb://127.0.0.1:27017/shopping
```

3) Quick PowerShell dev-only option (set env var for current session)

```powershell
# set MONGO_URI only for current PowerShell session
$env:MONGO_URI = "your_full_mongo_connection_string"
npm start
```

Notes:
- The project already uses `dotenv/config`, so a `.env` file in the `backend` folder is automatically loaded.
- I tried to start a Mongo container here but `docker` is not available on this machine (command not recognized). If you want, I can add a `docker-compose.yml` so you can run it locally after installing Docker.
 - I tried to start a Mongo container here but `docker` is not available on this machine (command not recognized). If you want, I added a `docker-compose.yml` to the `backend` folder — run `docker compose up -d` to start a local MongoDB instance on `localhost:27017`.
 
 Docker compose quick start:

 ```powershell
 cd "D:/Shopping cart application/backend"
 docker compose up -d
 ```
