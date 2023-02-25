//*We have already have not compile again file,only update when code change automatically

const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build"); 
console.log('buildPath', buildPath)
console.log('###################################################################')
fs.removeSync(buildPath);//!Removes a file or directory.

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
console.log('campaignPath', campaignPath)
console.log('###################################################################')


const source = fs.readFileSync(campaignPath, "utf8");//!read file content defined location file path but,In fs. readFile() method, we can read a file in a non-blocking asynchronous way, but in fs.
console.log('source', source)
console.log('###################################################################')

const output = solc.compile(source,1).contracts;//?return two contract object => CampaignFactory,Campaign for this moment we must have for loop inside this each object propery
console.log('output', output)
console.log('###################################################################')


fs.ensureDirSync(buildPath);//!Ensures that the directory exists. If the directory structure does not exist, it is created.

//?So we're going to eventually loop over this campaign and campaignfactory thing right here and then write out the contents to of it to two separate files.
for (let contract in output) {//?in keyword return index value object
    console.log('contract', contract)   
    console.log('###################################################################')
    fs.outputJsonSync(//!Writes an object to a JSON file asynchronous way,except that if the directory does not exist, it's created.
        path.resolve(buildPath, contract + ".json"),
        output[contract]//writing file this path
    );
}
