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
app.post("/add",async(req,res)=>{
    try {
        const data=req.body;
        const response = await axios.post("http://localhost:8000/products/add",data,{ headers: {"Content-Type": "application/x-www-form-urlencoded"}});
        console.log(response["data"]);
        res.redirect("/"); 
    } catch (err) {
        console.log(err);
        res.status(500).send("Error occurred");
    }       
})

app.get("/update/:id",async(req,res)=>{
    try {
        const id=req.params.id;
        const product=await axios.get(`http://localhost:8000/products/${id}`);
        res.render("update.ejs",{
            item:product.data
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(`Item with id =${id} doesn't exist.`);
    }     

})
app.post("/update/:id",async(req,res)=>{
    try {
        const id=req.params.id;
        var response;
        var filtered=Object.entries(req.body).filter(([key, value]) => value !== '');
        if(filtered.length<3&&filtered.length!=0){
            response=await axios.patch(`http://localhost:8000/products/update/${id}`,Object.fromEntries(filtered),{ headers: {"Content-Type": "application/x-www-form-urlencoded"}});
            console.log(response["data"]);
            res.redirect("/"); 
        }else if(filtered.length===3){
             response=await axios.put(`http://localhost:8000/products/update/${id}`,req.body,{ headers: {"Content-Type": "application/x-www-form-urlencoded"}});
             console.log(response["data"]);
             res.redirect("/"); 
        }
        else{
            console.log("No updates provided.");
            res.redirect("/");
        }; 
    } catch (err) {
        console.log(err);
        res.status(500).send("Error occurred");
    }  
})

app.get("/delete/:id",async (req,res)=>{
    try {
        const id=req.params.id;
        const response=await axios.delete(`http://localhost:8000/products/delete/${id}`);
        console.log(response["data"]);
        res.redirect("/");
    } catch (err) {
        console.log(err);
        res.status(500).send(`Item with id =${id} doesn't exist.`);
    }      
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
