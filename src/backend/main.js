const express = require("express")
const cors = require("cors")
const ratelimit = require("express-rate-limit")
const app = express()
const PORT = 5501

// Uses rate limiter.
const limiter = ratelimit({
    windowMs: 1 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
	legacyHeaders: false,
})
app.use(limiter)

// Disables the CORS on all routes.
app.use(cors({
    origin: "*"
}))

// Usable routes.
const sneakerRoutes = require('./routes/merch')
app.use(sneakerRoutes)

// Static images.
app.use('/img', express.static('img'))

// 404.
app.use((req, res, next) => {
    res.status(404).json(
        {"title": "An error occurred",
        "status": 404,
        "message": "Not Found"}
    )
})

// Launches the server
app.listen(PORT, () => console.log(`listening on port ${PORT}`))