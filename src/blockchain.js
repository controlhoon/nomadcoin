const CryptoJS = require("crypto-js");

class Block{
    constructor(index, hash, previousHash, timestamp, data){
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash
        this.timestamp = timestamp
        this.data = data;
    }
}

const genesisBlock = new Block(
    0,
    "2B1237178376A4FCA311ED7DBDA543994D5E4627691C62538F3F3E1950C5FC0D",
    null,
    1557900684215,
    "This is the genesis !!"
);

let blockchain = [genesisBlock];

const getLastBlock = () => blockchain[blockchain.length -1];

const getTimestamp = () => new Date().getTime() / 1000;

const getBlockchain = () => blockchain;

const createHash = (index, previousHash, timestamp, data) => 
    CryptoJS.SHA256(index + previousHash + timestamp + data).toString();

const createNewBlock = data => {
    const previousBlock = getLastBlock();
    const newBlockIndex = previousBlock.index + 1;
    const newTimestamp = getTimestamp();
    const newHash = createHash(
        newBlockIndex,
        previousBlock.hash,
        newTimestamp,
        data
    );
    const newBlock = new Block(
        newBlockIndex,
        newHash,
        previousBlock.hash,
        newTimestamp,
        data
    );
    return newBlock;
};

const getBlockHash = (block) => createHash(block.index, block.previousHash, block.timestamp, block.data);


//데이터가 양식에 맞게 잘 들어갔나 검증 과정

const isNewBlockValid = (candidateBlock, latestBlock) => {

    if(!isNewStructureValid(candidateBlock)) {
        console.log("The candidate block structure is not valid");
        return false;
    }
    else if(latestBlock.index + 1 !== candidateBlock.index){
        console.log("The candidate block doesn't have a valid index")
        return false;
    } else if(latestBlock.hash !== candidateBlock.previousHash){
        console.log("The previousHaso of the candidate block is not the hash of the latest block");
        return false;
    } else if(getBlockHash(candidateBlock) !==candidateBlock.hash){
        conseole.log("The hash of this block is invalid");
        return false;
    }
    return true;
};

const isNewStrutureValid = Block => {
    return (
        typeof block.index === "number" &&
        typeof block.hash === "string" &&
        typeof block.previousHash === "string" &&
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
        blockchain.push(candidiateBlock);
        return true;
    } else {
        return false;
    }
};