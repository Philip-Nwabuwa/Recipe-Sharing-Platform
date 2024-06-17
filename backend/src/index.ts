import express from "express"
import http from "http"
import bodyPaser from "body-parser"
import cookieParser from "cookie-parser"
import compression from "compression"
import cors from "cors"

const app = express()

app.use(cors ({
    credentials: true,
}))

app.use(compression())
app.use(cookieParser())
app.use(bodyPaser.json())

app.get("/", (req, res) => {
    res.send("Hello World")
})

const server = http.createServer(app)

server.listen(5000, () => {
    console.log("Server is running on http://localhost:5000")
})

export default server