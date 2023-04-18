const express = require("express")
const cors = require("cors")

const app = express()
const PORT = 5501

app.use(cors({
    origin: "*"
}))

const sneakerRoutes = require('./routes/merch')

app.use(sneakerRoutes)

app.listen(PORT, () => console.log(`listening on port ${PORT}`))