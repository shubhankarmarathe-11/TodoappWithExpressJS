const express = require('express')
const router = express.Router()
const path = require('path')
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')


router.use(bodyParser.json())


const main = async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/Todoapp");

}

main()





const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

const TodoData = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: false
    },
    todostatement: {
        type: String,
        required: true,
        unique: false
    },
    todotime:{
        type: String,
        required:true,
        unique:false
    }
})

const Users = mongoose.model("users", userSchema)
const todostatement = mongoose.model("tododata", TodoData)

router.get("/", (req, res) => {
    res.redirect("/login")
})


router.get("/users/:username", (req, res) => {
    if (req.session.username) {
        let username = req.params['username']
        const findInDB = async () => {
            let data = await Users.find({ username: username })
            if (data == "") {
                res.redirect('/login')
            }
            else {
                let data2 = await todostatement.find({ username: username })
                res.render("index", { data2: data2, username: username, todoflash: req.flash("todoflash") })
                
            }
        }
        findInDB()
    }
    else {
        res.redirect("/login")
    }

})


router.post("/users/:username", (req, res) => {

    let username = req.params['username']
    let todo = req.body.todo
    let todotime = req.body.time
    // console.log(todotime)
    //  var alarmSound = new Audio("../public/music.mp3");
    // function todonotify() {

    //     var now = new Date();
    //     var alarm = new Date(now.toDateString() + " " + todotime);
    //     var timeRemaining = alarm - now;

    //     setTimeout(playAlarm, timeRemaining);
    // }

    // function playAlarm() {
    //     //   alarmSound.play();
    //     // console.log("working")
    //     const notifier = require('node-notifier');
    //     // String
    //     notifier.notify('Message');

    //     // Object
    //     notifier.notify({
    //         title: 'My notification',
    //         message: todo
    //     });
    // }

    // todonotify()

    const findInDB = async () => {
        let data = await todostatement.find({ username: username, todostatement: todo })
        if (data == "") {
            let data2 = new todostatement({ username: username, todostatement: todo , todotime:todotime})
            let result = await data2.save()
            await res.redirect(`/users/${username}`)
        }
        else {
            req.flash("todoflash", "Todo Already Exist")
            res.redirect(`/users/${username}`)

        }
    }
    findInDB()

})



// router.post("/addtodo", (req, res) => {
//     let todo = req.body.todo;
//     res.send("Todo Added ---- " + todo)
// })


router.get("/login", (req, res) => {
    res.render("login", { loginmsg: req.flash("loginmsg") })
})


router.get("/signup", (req, res) => {
    res.render("signup", { signupmsg: req.flash("signupmsg") })
})

router.post("/login", (req, res) => {
    let username = req.body.username
    let password = req.body.password
    const findInDB = async () => {
        let data = await Users.find({ username: username, password: password })
        if (data == "") {
            req.flash("loginmsg", "Invalid Username And Password")
            res.redirect("/login")
            res.end()
        }
        else {
            req.session.username = username;
            await res.redirect(`/users/${username}`)
        }
    }
    findInDB()
})


router.post("/signup", (req, res) => {
    const username = req.body.name;
    // const email = req.body.email;
    const password = req.body.password;
    const findInDB = async () => {
        let data = await Users.find({ username: username })
        if (data == "") {
            let data2 = new Users({ username: username, password: password })
            let result = await data2.save()
            res.redirect(`/users/${username}`)
        }
        else {
            req.flash("signupmsg", "Invalid Username And Password")
            // res.send("Please Choose Another Username")
            res.redirect("/signup")
        }
    }
    findInDB()
})


router.get("/logout", (req, res) => {
    req.session.destroy()
    res.redirect('/')
})



router.get("/:username/complete/:todostatement", (req, res) => {
    const deleterecord = async () => {
        usernames = req.params['username']
        todo = req.params['todostatement']
        let data = await todostatement.findOneAndDelete({ username: usernames, todostatement: todo })
        // res.send("username"+usernames)
        res.redirect(`/users/${usernames}`)
    }
    deleterecord()
})


// var time = "34:26"
// var timeparts = time.split(":")
// console.log((+timeparts[0]*(60000*60)) + (+timeparts[1]*60000))

module.exports = router