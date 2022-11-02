import express from "express"
import cors from "cors"
import bodyParser from "body-parser"


const app = express()
app.use(bodyParser.json())
app.use(cors())

const port = 4002
const posts = {}

app.get("/posts", (req, res) => {

    res.send(posts)
})

app.post("/events", (req, res) => {
    console.log(`Query service received "${req.body.type}" event`)
    const { type, data } = req.body
    if (type === "PostCreated") {
        const { id } = data
        posts[id] = {...data, comments: []}
    }
    if (type==="CommentCreated") {
        const { id, content, postId, status } = data
        const post = posts[postId]
        post.comments.push({id, content, status})
    }
    if (type==="CommentModerated") {
        const { id, content, postId, status } = data
        const post = posts[postId]
        const comment = post.comments.find(c => c.id === id)
        comment.content = content
        comment.status = status    
    }
    res.send({status:201})
})

app.listen(port, () => console.log(`Query service listening at ${port}`))
