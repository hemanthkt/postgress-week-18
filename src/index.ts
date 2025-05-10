import { Client } from "pg";
import express from "express"
const app = express()
app.use(express.json())

 
// const pgClieent = new Client("postgresql://neondb_owner:npg_QCePW9k0FNYO@ep-tight-violet-a13zi3h3-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require")
const pgClient = new Client( {
    user:"neondb_owner",
    password: "npg_QCePW9k0FNYO",
    port: 5432,
    host: "ep-tight-violet-a13zi3h3-pooler.ap-southeast-1.aws.neon.tech",
    database: "neondb",
    ssl: true
})
  
 pgClient.connect();

app.post("/signup",async (req,res) => {
try {
    const {username, password, email, city, country,street, pincode} = req.body

    const userQuery = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id`
    const addressQuery = `INSERT INTO addresses(city, country, street, pincode, user_id) VALUES ($1, $2, $3, $4,$5)`

    pgClient.query("BEGIN;")
    
    const userResponse = await pgClient.query(userQuery, [username, password, email])
    const user_id = userResponse.rows[0].id
     await pgClient.query(addressQuery, [city,country, street, pincode, user_id])

    pgClient.query("COMMIT;")

    res.json({
        message: "You have signed up"
    })
} catch (error) {
    console.log(error);
     res.json({
        message: "Couldnt sign up"
    })
    
}
    

    
    
    
})



app.get("/metadata/:id",async (req,res) => {
    const id = req.params.id
    const query = `SELECT users.id, users.username, users.email, users.password, addresses.user_id, addresses.country, addresses.city, addresses.street, addresses.pincode FROM users JOIN addresses ON users.id = addresses.user_id WHERE users.id = $1;`
  const response =  await pgClient.query(query, [id])

  res.json(response.rows)
  
})

 app.listen(3000)