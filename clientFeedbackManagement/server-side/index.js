const express = require("express")
const path = require("path")

/* Routing Path */
const Root = require("./routes/root")
const feedbackAnalytics = require("./routes/analytics/feedbackAnalytics")
const login = require("./routes/authentication/login")
const signup = require("./routes/authentication/signup")
const client = require("./routes/client/client")
const clientDashboard = require("./routes/client/clientDashboard")
const clientFeedback = require("./routes/client/clientFeedback")
const clientHistory = require("./routes/client/clientHistory")
const admin = require("./routes/admin/admin")
const adminDashBoard = require("./routes/admin/adminDashBoard")
const adminManagement = require("./routes/admin/adminManagement")
const adminExports = require("./routes/admin/adminExports")


const app = express()
const PORT = 3000

/* Access to static files */
app.use(express.static(path.join(__dirname, '..', 'client-side', 'dist')))

/* Routing */
app.use("/", Root)
app.use("/analytics", feedbackAnalytics)

// Authentication Routing 
app.use("/login", login)
app.use("/signup", signup)

// Client Routing
app.use("/client", client)
app.use("/client/dashboard", clientDashboard)
app.use("/client/dashboard/feedback", clientFeedback)
app.use("/client/dashboard/history", clientHistory)

// Admin Routing
app.use("/admin", admin)
app.use("/admin/dashboard", adminDashBoard)
app.use("/admin/dashboard/manage", adminManagement)
app.use("/admin/dashboard/manage/export", adminExports)

app.listen(PORT, () => {
    console.log(`server started successfully at http://localhost:${PORT}`);
})