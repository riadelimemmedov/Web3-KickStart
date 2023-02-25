const path = require('path');
const solc = require('solc');
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build"); 
console.log('buildPath', buildPath)
console.log('###################################################################')
fs.removeSync(buildPath);

// const lotteryPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
// const source = fs.readFileSync(lotteryPath, 'utf8');

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
console.log('campaignPath', campaignPath)
console.log('###################################################################')


const source = fs.readFileSync(campaignPath, "utf8");//!read file content defined location file path but,In fs. readFile() method, we can read a file in a non-blocking asynchronous way, but in fs.
console.log('source', source)
console.log('###################################################################')


const input = {
    language: 'Solidity',
    sources: {
        'Campaign.sol': {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*'],
            },
        },
    },
};

console.log('returned input value  ', input)
console.log('################################################################################################################################')

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
    'Campaign.sol'
];

console.log('RETURNED OUTPUT VALUE ', output)


fs.ensureDirSync(buildPath)

for (let contract in output) {//?for in used object,for of used array
    console.log('contract', contract)//return object key value
    console.log('###################################################################')
    fs.outputJsonSync(//!Writes an object to a JSON file asynchronous way,except that if the directory does not exist, it's created.
        path.resolve(buildPath, contract + ".json"),
        output[contract]//writing file this path,return value from object
    );
}


// module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
//     'Lottery.sol'
// ].Lottery;