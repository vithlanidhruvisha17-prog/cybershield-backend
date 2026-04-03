require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const Groq = require("groq-sdk");
const fileUpload = require("express-fileupload");
const Tesseract = require("tesseract.js");
const nodemailer = require("nodemailer");

const app = express();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Middleware
app.use(cors({
    origin: "*", // Sabko allow karo
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(fileUpload()); 

/* ---------------- DATABASE CONNECTION ---------------- */
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected... ✅"))
    .catch(err => console.log("DB Error:", err));

/* ---------------- SCHEMAS & MODELS ---------------- */

const UserSchema = new mongoose.Schema({
    fullname: String,
    email: { type: String, unique: true },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "" },
    bio: { type: String, default: "" },
    // ✅ Added for Forgot Password
    resetOTP: String,
    otpExpires: Date,
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model("User", UserSchema, "users");

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

const Follow = mongoose.model("Follow", new mongoose.Schema({
    follower: String,
    following: String
}), "Follows");


/* ---------------- FINAL GMAIL CONFIG (SSL) ---------------- */
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Port 587 ke liye false hona chahiye (TLS)
    auth: {
        user: 'vithlanidhruvisha17@gmail.com',
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // Connection timeout aur security block rokne ke liye
    }
});

// Isse verify ho jayega
transporter.verify((error, success) => {
    if (error) {
        console.log("❌ Connection Error:", error.message);
    } else {
        console.log("🚀 Server is connected and ready to send OTP!");
    }
});


/* ---------------- AUTH ROUTES (Login, Signup, Forgot Password) ---------------- */

app.post("/api/signup", async (req, res) => {
    try {
        const { username, email, fullname, password } = req.body;
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) return res.status(400).json({ success: false, message: "Username or Email already taken!" });

        const newUser = new User({ fullname, email, username, password });
        await newUser.save();
        res.json({ success: true, user: { username: newUser.username } });
    } catch (err) {
        res.status(500).json({ success: false, message: "Database Error" });
    }
});

app.post("/api/login", async (req, res) => {
    const { username, password, email, isGoogleUser } = req.body;

    try {
        if (isGoogleUser) {
            // 1. Google User ko Email se dhoondo
            let user = await User.findOne({ email });

            if (user) {
                // Agar user mil gaya toh login success
                return res.json({ success: true, user: { username: user.username } });
            } else {
                // 2. AGAR USER NAHI HAI TOH AUTO-SIGNUP (Naya feature)
                // Google user ka username unki email ka pehla part bana do
                const generatedUsername = email.split("@")[0] + Math.floor(Math.random() * 1000);
                
                const newUser = new User({ 
                    fullname: "Google User", 
                    email: email, 
                    username: generatedUsername, 
                    password: "google-auth-user-" + Math.random() // Dummy password
                });

                await newUser.save();
                return res.json({ success: true, user: { username: newUser.username } });
            }
        }

        // --- Normal Login Logic (Puraana wala) ---
        const user = await User.findOne({ username, password });
        if (user) {
            res.json({ success: true, user: { username: user.username } });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

app.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.json({ success: false, message: "User not found!" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOTP = otp;
        user.otpExpires = Date.now() + 600000;
        await user.save();

        console.log(`🔥 OTP generated for ${email}: ${otp}`);

        const mailOptions = {
            from: 'vithlanidhruvisha17@gmail.com',
            to: email,
            subject: 'CyberShield Reset OTP',
            html: `
                <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #FFD700;">CyberShield Security</h2>
                    <p>Aapka password reset OTP niche diya gaya hai:</p>
                    <h1 style="letter-spacing: 5px; color: #333;">${otp}</h1>
                    <p>Ye OTP 10 minute tak valid hai.</p>
                </div>
            `
        };

        // Mail bhej rahe hain
        await transporter.sendMail(mailOptions);
        
        console.log("✅ Mail Sent Successfully via Gmail");
        return res.status(200).json({ success: true, message: "OTP sent!" });

    } catch (err) {
        console.log("❌ Gmail Send Error:", err.message);
        return res.status(500).json({ success: false, message: "Server error while sending mail" });
    }
});

// 2. RESET PASSWORD - Verify & Change
app.post('/api/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const user = await User.findOne({ 
            email, 
            resetOTP: otp, 
            otpExpires: { $gt: Date.now() } 
        });

        if (!user) return res.json({ success: false, message: "Invalid OTP ya expired!" });

        user.password = newPassword; 
        user.resetOTP = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({ success: true, message: "Password updated!" });
    } catch (err) {
        res.json({ success: false, message: "Failed to reset!" });
    }
});

/* ---------------- AI ANALYSIS ROUTES ---------------- */

app.post("/analyze", async (req, res) => {
    const { text, username } = req.body;
    if (!text) return res.status(400).json({ error: "Text required" });
    
    try {
        console.log("Starting Groq Analysis for:", text); // Debugging line
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a Cyber Security Expert. Analyze for threats, Risk Rating (0-10), and 3 safety tips." },
                { role: "user", content: text }
            ],
            model: "llama3-8b-8192", // Zyadatar stable model ye hai
        });

        const aiText = chatCompletion.choices[0]?.message?.content || "Analysis Failed";
        
        // Report save kar rahe hain
        await Report.create({ text, result: aiText, username: username || "Anonymous" });
        
        res.json({ success: true, result: aiText });
    } catch (error) {
        console.error("❌ Groq API Error:", error.message); // Isse Render logs mein asli wajah dikhegi
        res.status(500).json({ success: false, message: "AI Busy or API Error", error: error.message });
    }
});

app.get('/api/reports-count/:username', async (req, res) => {
    try {
        const count = await Report.countDocuments({ username: req.params.username });
        res.json({ count });
    } catch (err) {
        res.status(500).json({ error: "Count fetch failed" });
    }
});

app.post("/analyze-image", async (req, res) => {
    if (!req.files || !req.files.image) return res.status(400).json({ error: "No image" });
    const imageFile = req.files.image;
    const username = req.body.username || "Anonymous"; 
    const base64Image = `data:${imageFile.mimetype};base64,${imageFile.data.toString('base64')}`;

    try {
        const worker = await Tesseract.createWorker('eng');
        const { data: { text } } = await worker.recognize(imageFile.data);
        await worker.terminate(); 

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "system", content: "You are a Cyber Security Expert. Analyze for threats, Risk Rating (0-10), and 3 safety tips." }, { role: "user", content: text }],
            model: "llama3-8b-8192",
        });
        const aiText = chatCompletion.choices[0]?.message?.content || "Analysis Failed";
        await Report.create({ text, image: base64Image, result: aiText, username });
        res.json({ success: true, result: aiText, image: base64Image });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ---------------- FEED & SOCIAL SYSTEM ---------------- */

app.get('/api/reports', async (req, res) => {
    try {
        const reports = await Report.find().sort({ createdAt: -1 }).limit(100).lean();
        const reportsWithUserStats = await Promise.all(reports.map(async (post) => {
            const userData = post.username ? await User.findOne({ username: post.username }, 'profilePic').lean() : null;
            return { ...post, userProfilePic: userData?.profilePic || "" };
        }));
        res.json(reportsWithUserStats);
    } catch (err) { res.status(500).json({ error: "Internal Server Error" }); }
});

app.get('/api/user-reports/:username', async (req, res) => {
    try {
        const reports = await Report.find({ username: { $regex: new RegExp("^" + req.params.username + "$", "i") } }).sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) { res.status(500).json({ error: "Could not fetch user history" }); }
});

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

/* ---------------- REAL-TIME CYBER NEWS LOGIC ---------------- */
app.get("/api/cyber-news", async (req, res) => {
    try {
        // Hum BleepingComputer ka RSS feed use kar rahe hain real-time news ke liye
        const rssUrl = "https://www.bleepingcomputer.com/feed/";
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;
        
        const response = await axios.get(apiUrl);
        
        const newsTitles = response.data.items.slice(0, 12).map(item => item.title);
        
        res.json({ 
            success: true, 
            news: newsTitles 
        });
    } catch (err) {
        console.error("News Fetch Error:", err.message);
        res.json({ 
            success: true, 
            news: [
                "⚠️ Security Alert: Keep your software updated.",
                "🛡️ Tip: Use Multi-Factor Authentication (MFA) everywhere.",
                "🚫 Phishing Warning: Don't click on suspicious links."
            ] 
        });
    }
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

app.post("/api/unfollow", async (req, res) => {
    const { follower, following } = req.body;
    try {
        await Follow.findOneAndDelete({ follower, following });
        res.status(200).json({ success: true, message: "Unfollowed successfully!" });
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

/* ---------------- PROFILE & SEARCH ---------------- */

app.get("/api/user-details/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: { $regex: new RegExp("^" + req.params.username + "$", "i") } });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ fullname: user.fullname, bio: user.bio, profilePic: user.profilePic, email: user.email });
    } catch (err) { res.status(500).json({ error: "DB Error" }); }
});

app.post("/api/update-profile", async (req, res) => {
    const { username, displayName, bio, newProfilePic } = req.body;
    try {
        const updatedUser = await User.findOneAndUpdate({ username }, { fullname: displayName, bio, profilePic: newProfilePic }, { new: true });
        res.json({ success: true, user: updatedUser });
    } catch (err) { res.status(500).json({ error: "Failed to update profile" }); }
});

app.get('/api/search-users', async (req, res) => {
    const query = req.query.q;
    if (!query || query.trim().length < 2) return res.json([]); 
    try {
        const users = await User.find({ $or: [{ username: new RegExp(query, 'i') }, { fullname: new RegExp(query, 'i') }] })
            .select('username fullname profilePic bio').limit(10).lean();
        res.json(users);
    } catch (err) { res.status(500).json({ error: "Search failed" }); }
});

/* ---------------- SERVER START ---------------- */
app.get("/", (req, res) => res.send("CyberShield Backend Live 🚀"));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));