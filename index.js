import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const blogPosts = {
    title: [],
    content: [],
};

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add this to parse JSON request body

app.get("/", (req, res) => {
    res.render("index.ejs");
});
  
app.get("/blogs-display", (req, res) => {
    res.render("blogs-display.ejs", { title: blogPosts.title });
});

app.post("/submit", (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        let errorMessage = "";

        if (!title && !content) {
            errorMessage = "You have not written anything.";
        } else if (!title) {
            errorMessage = "You have no title.";
        } else if (!content) {
            errorMessage = "You have no blog content.";
        }

        res.render('index.ejs', { errorMessage });
    } else {
        blogPosts.title.push(title);
        blogPosts.content.push(content);
        res.redirect("/blogs-display");
    }
});

app.get("/view", (req, res) => {
    const blogIndex = req.query.index;
    const selectedTitle = blogPosts.title[blogIndex];
    const selectedContent = blogPosts.content[blogIndex];

    res.render("blog-page.ejs", {
        title: selectedTitle,
        content: selectedContent,
        index: blogIndex // Pass the index to the template
    });
});

app.delete("/delete-blog", (req, res) => {
    const blogIndex = req.body.index; // Get the blog index from the request body
    if (blogIndex >= 0 && blogIndex < blogPosts.title.length) {
        blogPosts.title.splice(blogIndex, 1);
        blogPosts.content.splice(blogIndex, 1);
        res.status(200).json({ success: true });
    } else {
        res.status(400).json({ success: false, message: "Invalid index" });
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
