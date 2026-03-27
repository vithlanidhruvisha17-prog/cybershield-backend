require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const Groq = require("groq-sdk");
const fileUpload = require("express-fileupload");
const Tesseract = require("tesseract.js");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const app = express();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Middleware
app.use(cors()); 
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(fileUpload()); 
/* ---------------- DATABASE CONNECTION ---------------- */
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected... ✅"))
    .catch(err => console.log("DB Error:", err));

/* ---------------- SCHEMAS & MODELS ---------------- */
const ReportSchema = new mongoose.Schema({
    text: String,
    image: String,
    result: String,
    label: String,
    username: { type: String, default: "Anonymous" },
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    comments: [{ username: String, text: String, date: { type: Date, default: Date.now } }]
});
const Report = mongoose.model("Report", ReportSchema, "Reports");

const UserSchema = new mongoose.Schema({
    fullname: String,
    email: { type: String, unique: true },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "" },
    bio: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model("User", UserSchema, "users");

const Follow = mongoose.model("Follow", new mongoose.Schema({
    follower: String,  // Jo follow kar raha hai
    following: String  // Jise follow kiya ja raha hai
}), "Follows");
/* ---------------- AI ANALYSIS ROUTES ---------------- */

// 1. Text Analysis & Auto-Post
app.post("/analyze", async (req, res) => {
    const { text, username } = req.body;
    if (!text) return res.status(400).json({ error: "Text required" });

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a Cyber Security Expert. Analyze for threats, Risk Rating (0-10), and 3 safety tips." },
                { role: "user", content: text },
            ],
            model: "llama-3.3-70b-versatile",
        });

        const aiText = chatCompletion.choices[0]?.message?.content || "Analysis Failed";
        await Report.create({ text, result: aiText, username: username || "Anonymous" });
        res.json({ success: true, result: aiText });
    } catch (error) {
        res.status(500).json({ success: false, message: "AI Busy" });
    }
});

// 2. Image OCR & AI Analysis
app.post("/analyze-image", async (req, res) => {
    if (!req.files || !req.files.image) return res.status(400).json({ error: "No image" });

    const imageFile = req.files.image;
    const username = req.body.username || "Anonymous"; 
    // Image ko save karne ke liye base64 format mein convert karna
    const base64Image = `data:${imageFile.mimetype};base64,${imageFile.data.toString('base64')}`;

    try {
        // --- Tesseract OCR ---
        const worker = await Tesseract.createWorker('eng');
        const { data: { text } } = await worker.recognize(imageFile.data);
        await worker.terminate(); 

        // --- Groq AI Analysis ---
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a Cyber Security Expert. Analyze for threats, Risk Rating (0-10), and 3 safety tips." },
                { role: "user", content: text },
            ],
            model: "llama-3.3-70b-versatile",
        });

        const aiText = chatCompletion.choices[0]?.message?.content || "Analysis Failed";
        
        // --- DB mein save karna: OCR Text + Image + Analysis ---
        await Report.create({ 
            text: text,        // OCR se nikla text (Taki text feed mein dikhe)
            image: base64Image, // Asli image bhi save ho
            result: aiText,    // AI ki analysis
            username: username 
        });
        
        res.json({ success: true, result: aiText, image: base64Image });
    } catch (err) {
        console.error("OCR/AI Error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/forgot-password", async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Temporary Token (Sirf 1 ghante ke liye)
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Nodemailer Config (Email bhejne ke liye)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });

        const mailOptions = {
            to: user.email,
            subject: 'CyberShield Password Reset',
            text: `Aapka password reset link ye raha: \n\n http://localhost:3000/reset/${resetToken}`
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Reset link sent to email!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ---------------- FEED & SOCIAL SYSTEM ---------------- */

// Main Feed
// server.js mein is block ko update karein
app.get('/api/reports', async (req, res) => {
    try {
        const reports = await Report.find().sort({ createdAt: -1 }).limit(100).lean();
        
        const reportsWithUserStats = await Promise.all(reports.map(async (post) => {
            // Check if post.username exists
            const userData = post.username 
                ? await User.findOne({ username: post.username }, 'profilePic').lean() 
                : null;
            
            return { 
                ...post, 
                userProfilePic: (userData && userData.profilePic) ? userData.profilePic : "" 
            };
        }));

        res.json(reportsWithUserStats);
    } catch (err) { 
        console.error("Feed Error:", err);
        res.status(500).json({ error: "Internal Server Error" }); 
    }
});
// Profile Grid (User specific history - Case Insensitive)
app.get('/api/user-reports/:username', async (req, res) => {
    try {
        const reports = await Report.find({ 
            username: { $regex: new RegExp("^" + req.params.username + "$", "i") } 
        }).sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) { res.status(500).json({ error: "Could not fetch user history" }); }
});

// Stats Count (Reports count for profile)
app.get('/api/user-reports-count/:username', async (req, res) => {
    try {
        const count = await Report.countDocuments({ 
            username: { $regex: new RegExp("^" + req.params.username + "$", "i") } 
        });
        res.json({ count });
    } catch (err) { res.status(500).json({ error: "DB error" }); }
});

// Engagement (Likes & Comments)
app.post("/api/reports/:id/like", async (req, res) => {
    try {
        const report = await Report.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
        res.json({ success: true, likes: report.likes });
    } catch (err) { res.status(500).json({ error: "Like failed" }); }
});

app.post("/api/reports/:id/comment", async (req, res) => {
    try {
        const { username, text } = req.body;
        const report = await Report.findByIdAndUpdate(req.params.id, { $push: { comments: { username, text } } }, { new: true });
        res.json({ success: true, report });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ---------------- FOLLOW SYSTEM ---------------- */

app.post("/api/follow", async (req, res) => {
    const { follower, following } = req.body;
    try {
        const existingFollow = await Follow.findOne({ follower, following });
        if (existingFollow) return res.status(400).json({ message: "Already following." });
        await new Follow({ follower, following }).save();
        res.status(200).json({ success: true, message: "Followed successfully!" });
    } catch (err) { res.status(500).json({ error: "Server error" }); }
});

app.get('/api/is-following/:follower/:following', async (req, res) => {
    try {
        const connection = await Follow.findOne({ follower: req.params.follower, following: req.params.following });
        res.json({ following: !!connection });
    } catch (err) { res.status(500).json({ error: "DB Error" }); }
});

app.get('/api/followers/:username', async (req, res) => {
    try {
        const followers = await Follow.countDocuments({ following: req.params.username });
        const following = await Follow.countDocuments({ follower: req.params.username });
        res.json({ followersCount: followers, followingCount: following });
    } catch (err) { res.status(500).json({ error: "DB error" }); }
});

/* ---------------- AUTH & UTILS ---------------- */

app.post("/api/signup", async (req, res) => {
    try {
        const { username, email, fullname, password } = req.body;
        
        // 1. Check if user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Username or Email already taken!" });
        }

        // 2. Create new user
        const newUser = new User({ fullname, email, username, password });
        await newUser.save();

        res.json({ success: true, user: { username: newUser.username } });
    } catch (err) {
        console.error("Signup DB Error:", err); // Ye aapko terminal mein error dikhayega
        res.status(500).json({ success: false, message: "Database Error: " + err.message });
    }
});

app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) res.json({ success: true, user: { username: user.username } });
    else res.json({ success: false, message: "Invalid credentials" });
});

app.get("/api/cyber-news", async (req, res) => {
    try {
        const response = await axios.get("https://api.rss2json.com/v1/api.json?rss_url=https://www.bleepingcomputer.com/feed/");
        res.json({ success: true, news: response.data.items.slice(0, 50).map(i => i.title) });
    } catch (err) { res.json({ success: true, news: ["Update your security settings!"] }); }
});

app.get('/api/is-following/:follower/:following', async (req, res) => {
    try {
        const connection = await Follow.findOne({ follower: req.params.follower, following: req.params.following });
        res.json({ following: !!connection });
    } catch (err) { res.status(500).json({ error: "DB Error" }); }
});

app.post("/api/unfollow", async (req, res) => {
    const { follower, following } = req.body;
    try {
        await Follow.findOneAndDelete({ follower, following });
        res.status(200).json({ success: true, message: "Unfollowed successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/api/user-details/:username", async (req, res) => {
    try {
        // Find user ignoring case (i option)
        const user = await User.findOne({ 
            username: { $regex: new RegExp("^" + req.params.username + "$", "i") } 
        });
        if (!user) return res.status(404).json({ error: "User not found" });
        
        res.json({
            fullname: user.fullname,
            bio: user.bio,
            profilePic: user.profilePic
        });
    } catch (err) {
        res.status(500).json({ error: "DB Error" });
    }
});

app.post("/api/update-profile", async (req, res) => {
    const { username, displayName, bio, newProfilePic } = req.body;

    try {
        const updatedUser = await User.findOneAndUpdate(
            { username: username },
            { 
                fullname: displayName, 
                bio: bio, 
                profilePic: newProfilePic 
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ success: true, user: updatedUser });
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ error: "Failed to update profile" });
    }
});

/* ---------------- SEARCH SYSTEM ---------------- */

/* ---------------- SEARCH SYSTEM (Corrected) ---------------- */

app.get('/api/search-users', async (req, res) => {
    const query = req.query.q;
    if (!query || query.trim().length < 2) return res.json([]); 

    try {
        const searchTerm = query.trim(); // Space hatao
        const users = await User.find({
            $or: [
                { username: new RegExp(searchTerm, 'i') }, 
                { fullname: new RegExp(searchTerm, 'i') }
            ]
        })
        .select('username fullname profilePic bio')
        .limit(10)
        .lean();

        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Search failed" });
    }
});

/* ---------------- SERVER START ---------------- */
app.get("/", (req, res) => res.send("CyberShield Backend Live 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));