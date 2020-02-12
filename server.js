const express = require("express")
const server = express()
const cors = require("cors")
const answers = require("./answers")

server.use(cors())

server.get("/questions", (req, res) => {
  res.sendFile("api-response.txt", { root: __dirname })
})

server.get("/score", (req, res) => {
  const totalScore = Object.entries(req.query).reduce(
    (score, [question, answer]) =>
      answers[question.toLowerCase()] === answer ? score + 1 : score,
    0
  )

  res.send(`${totalScore}`)
})

module.exports = server
