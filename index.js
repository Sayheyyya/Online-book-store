// Import necessary libraries
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var path = require("path");

// Create express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the public directory
app.use('/css', express.static(path.join(__dirname, 'assets/css'))); // Serve static files from the assets/css directory
app.use('/logo', express.static(path.join(__dirname, 'assets/img/logo')));
app.use('/plugins', express.static(path.join(__dirname, 'assets/plugins')));
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/Online-book-store", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

var db = mongoose.connection;

// Check for connection errors
db.on("error", () => console.log("Error in connecting to database"));
db.once("open", () => console.log("Connected to Database"));

// Serve index.html from the specified path
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html')); // Correct path to index.html
});

// Login Route
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        // Check if the user exists in the database
        const user = await db.collection("user").findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email! Please create an account first." });
        }

        // Validate password
        if (user.password === password) {
            return res.status(200).json({ message: "Login successful!" });
        } else {
            return res.status(400).json({ message: "Invalid Password!" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// Start the server
app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
});
