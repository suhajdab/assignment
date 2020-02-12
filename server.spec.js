const server = require("./server") // Link to your server file
const supertest = require("supertest")
const request = supertest(server)
const readFile = require("util").promisify(require("fs").readFile)

it("Get questions from /questions", async done => {
  const response = await request.get("/questions")
  const expected = await readFile("./api-response.txt", "utf8")

  expect(response.text).toBe(expected)

  done()
})

it("responds with number of correct answers (6)", async done => {
  const response = await request.get(
    "/score?" +
      [
        "Quiz.Q1.Guess=Apple",
        "Quiz.Q2.Guess=Motherboard",
        "Quiz.Q3.Guess=80",
        "Quiz.Q4.Guess=Heat Sink",
        "Quiz.Q5.Guess=128 bits",
        "Quiz.Q6.Guess=1GB"
      ].join("&")
  )
  const expected = "6"

  expect(response.text).toBe(expected)

  done()
})

it("responds with number of correct answers (1)", async done => {
  const response = await request.get(
    "/score?" +
      [
        "Quiz.Q1.Guess=Apple",
        "Quiz.Q2.Guess=Hard Disk Drive",
        "Quiz.Q3.Guess=443"
      ].join("&")
  )
  const expected = "1"

  expect(response.text).toBe(expected)

  done()
})

it("should not crash on wrong query", async done => {
  const response = await request.get(
    "/score?" +
      [
        "query=nope not this",
        "Quiz.Q2.Guess=Motherboard",
        "Quiz.Q1.Guess=Apple"
      ].join("&")
  )
  const expected = "2"

  expect(response.text).toBe(expected)

  done()
})
