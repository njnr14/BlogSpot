require("dotenv").config();

const express = require('express');
const path  = require('path');
const mongoose = require('mongoose');
const userRoute = require('./routes/user');
const blogRoute  = require('./routes/blog');
const cookieParser  = require("cookie-parser");
const { checkForAuthenticationCookie } = require('./middleware/authentication');
const Blog = require('./models/blog');





const app = express();
const PORT = process.env.PORT || 8000;
mongoose.connect(process.env.MONGO_URL).then((e) => console.log("mongodb connected"));

//middleware
app.use(express.urlencoded({ extended : false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve('./public')));

//ejs setup
app.set('view engine' , 'ejs');
app.set("views" , path.resolve('./views'));


//routes
app.get('/', async (req,res) => {
    // console.log(req.user);

    const allBlog = await Blog.find({});
    res.render('home' , {
        user : req.user,
        blogs : allBlog,
    });
});

app.use("/user" , userRoute);
app.use("/blog" , blogRoute);

app.listen(PORT , ()=> console.log(`server started at PORT: ${PORT}`));

