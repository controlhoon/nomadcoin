const CryptoJS = require("crypto-js");

// 블록의 클래스 선언 (인덱스, 현재해쉬, 이전해쉬, 차량번호, 만든시간, 데이터)
class Block{
    constructor(index, hash, previousHash, carNo, timestamp, data){
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.carNo = carNo;
        this.timestamp = timestamp;
        this.data = data;
    }
}
// 초기블록 선언 변경불가(재선언 불가) 
//const 와 let의 차이점은 const는 선언과 동시에 값을 할당해야 하고 let은 값을 할당하기전에 변수가 선언되어 있어야함.
const genesisBlock = new Block(
    0,
    "2B1237178376A4FCA311ED7DBDA543994D5E4627691C62538F3F3E1950C5FC0D",
    null,
    "99거 9999",
    1557900684215,
    "This is the genesis !!"
);
//blockchain 배열선언 안에 초기블록삽입
let blockchain = [genesisBlock];
//getLastBlock 함수 선언 blockchain배열[블록체인배열길이-1 인덱스값] 불러오는함수
const getLastBlock = () => blockchain[blockchain.length -1];
//getTimestamp 함수 선언, 시간 불러옴
const getTimestamp = () => new Date().getTime() / 1000;

//blockchain을 불러옴.
const getBlockchain = () => blockchain;
// createHash 선언 index, 이전해쉬값, ,차량번호 , 타임스탬프, 데이터 값을 CryptoJS.SHA256방식으로 얻어낸 해쉬값을 string타입으로 가져옴.
const createHash = (index, previousHash, carNo, timestamp, data) => 
    CryptoJS.SHA256(index + previousHash + JSON.stringify(carNo) + timestamp + JSON.stringify(data)
    ).toString();

const createNewBlock = (carNo,data) => {    
    const previousBlock = getLastBlock();
    const newBlockIndex = previousBlock.index + 1;
    const newTimestamp = getTimestamp();
    const newHash = createHash(
        newBlockIndex,
        previousBlock.hash,
        carNo,
        newTimestamp,
        data
    );
    const newBlock = new Block(
        newBlockIndex,
        newHash,
        previousBlock.hash,
        carNo,
        newTimestamp,
        data
    ); 
    addBlockToChain(newBlock);
    return newBlock;
};

const getBlockHash = (block) => createHash(block.index, block.previousHash, block.carNo, block.timestamp, block.data);

//데이터가 양식에 맞게 잘 들어갔나 검증 과정

const isNewBlockValid = (candidateBlock, latestBlock) => {
    if(!isNewStructureValid(candidateBlock)){
      console.log("The candidate block structure is not valid")
      return false;
    }else if(latestBlock.index + 1 !== candidateBlock.index){
      console.log("The candidate block doesnt have a valid index")
      return false;
    }else if(latestBlock.hash !== candidateBlock.previousHash){
      console.log(
        "The previousHash of the candidate block is not the latest block"
      );
      return false;
    }else if(getBlockHash(candidateBlock) !== candidateBlock.hash){
      console.log("The hash of this block is invalid");
      return false;
    }
    return true;
  };

const isNewStructureValid = block => {
    return (
        typeof block.index === "number" &&
        typeof block.hash === "string" &&
        typeof block.previousHash === "string" &&
        typeof block.carNo === "string" &&
        typeof block.timestamp === "number" &&
        typeof block.data === "string"
    );
};

const isChainValid = (candidateChain) => {
    const isGenesisValid = block => {
        return JSON.stringify(block) === JSON.stringify(genesisBlock);
    };
    if(!isGenesisValid(candidateChain[0])){
        console.log("the candidateChains's genesisBlock is not the same as our genesisBlock");
        return false;
    }
    // i가 1인 이유는 제네시스 블록은 검증할 필요 없어서
    for(let i= 1; i < candidateChain.length; i++){
        if(!isNewBlockValid(candidateChain[i], candidateChain[i-1])){
            return false;
        }
    }
    return true;
};

//블록체인이 유효하다면 이를 교체하기 위한 함수가 필요함
//이유 = 항상 더 긴 블록체인을 원하기 때문
const replaceChain = candidateChain =>{
    if(isChainValid(candidateChain) && candidateChain.length > getBlockchain().length){
        blockchain = candidateChain;
        return true;
    } else{
        return false;
    }
};

const addBlockToChain = candidateBlock => {
    if(isNewBlockValid(candidateBlock,getLastBlock())){
        blockchain.push(candidateBlock);
        return true;
    } else {
        return false;
    }
};

//서버를 생성하기전 함수 export 
module.exports = {
    getBlockchain,
    createNewBlock
}