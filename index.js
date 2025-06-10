import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
    try {
        const products = await axios.get("http://localhost:8000/products");
        res.render("index.ejs",{
            prods:products["data"]
        })
    } catch (err) {
        console.log(err);
        res.status(500).send("Error occurred");
    }
});

app.get("/add",async(req,res)=>{
    res.render("add.ejs");
})

app.get("/update",async(req,res)=>{
    res.render("update.ejs");
})

app.post("/add",async(req,res)=>{
    try {
        const data=req.body;
        console.log(data);
        const response = await axios.post("http://localhost:8000/products/add",data,{ headers: {"Content-Type": "application/x-www-form-urlencoded"}});
        console.log(response["data"]);
        res.redirect("/"); 
    } catch (err) {
        console.log(err);
        res.status(500).send("Error occurred");
    }       
})

app.post("/update",async(req,res)=>{
    try {
        const data=req.body;
        console.log(data);
        // res.redirect("/"); 
    } catch (err) {
        console.log(err);
        res.status(500).send("Error occurred");
    }  
})


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
