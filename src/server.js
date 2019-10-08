const express = require("express"),
    bodyParser = require("body-parser"),
    morgan = require("morgan"),
    Blockchain = require("./blockchain");

const { getBlockchain, createNewBlock } = Blockchain;

const PORT = 3000;

const app = express();
app.use(bodyParser.json());
app.use(morgan("combined"));

//누군가 블록을 얻으면 리턴 1   
app.get("/blocks", (req, res) => {
    res.send(getBlockchain());
});
//블록을 포스트하면
app.post("/blocks", (req, res) => {
    const { body: {carNo}, body:{data} } = req;
    const newBlock = createNewBlock(carNo,data);
    res.send(newBlock);
}); 
// ` 억음부호 사용하여 $로 변수값을 편하게 가져다씀
app.listen(PORT, () => console.log(`Nomadcoin Server running on ${PORT} `));
