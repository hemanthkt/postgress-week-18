import { Client } from "pg";

// const pgClieent = new Client("postgresql://neondb_owner:npg_QCePW9k0FNYO@ep-tight-violet-a13zi3h3-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require")

const pgClient = new Client( {
    user:"neondb_owner",
    password: "npg_QCePW9k0FNYO",
    port: 5432,
    host: "ep-tight-violet-a13zi3h3-pooler.ap-southeast-1.aws.neon.tech",
    database: "neondb",
    ssl: true
})

async function main( ) {
    await pgClient.connect()
    const response = await pgClient.query("UPDATE users SET username='hemanthkttt' WHERE id=6")
    console.log(response.rows);
    
    
}

main()