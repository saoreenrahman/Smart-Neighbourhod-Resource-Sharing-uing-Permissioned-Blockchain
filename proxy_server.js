var express = require('express');
var app=express();
var bodyParser= require('body-parser');
var jwt=require('jsonwebtoken');
const fs = require('fs');
const Web3 = require('web3');
const fileUpload = require('express-fileupload');
var session = require('express-session');


app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
              secret: 'keyboard cat',
              resave: false,
              saveUninitialized: true,
              cookie: { maxAge: 60000 }
            }))

app.use(express.static('./'));
app.use(express.static('./webpages'));


//add resource
app.get('/', (req,res)=>{
    res.sendFile('add_resource.html');
}); 

//add resource
app.get('/', (req,res)=>{
    res.sendFile('add_resource_v1.html');
});

//Contact Us
app.get('/', (req,res)=>{
    res.sendFile('Contact_Us.html');
});

app.get('/', (req,res)=>{
    res.sendFile('glosary.html');
});


app.get('/', (req,res)=>{
    res.sendFile('resource_prepare.html');
});

//view resource
app.get('/', (req,res)=>{
    res.sendFile('view_resource.html');
});

app.get('/', (req,res)=>{
    res.sendFile('view_resource_single_page.html');
});

app.get('/', (req,res)=>{
    res.sendFile('support.html');
});


//External JS files Call

//signature scheme for AAS (both DS and RS)
const lib = require("./aas.js");

//signature scheme for client (both DS and RS)
const lib_client = require("./client_side");

//CPABE Encryption
const shell = require("./CPABE");

//App running on port 4000

app.listen(4000, function(){
  console.log('listening on port 4000');
});


// .... MYSql DB Connection.....
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'rimjhim',
  password: 'rimjhim',
  database: 'devtech'
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Mysql Connected!');
});


//.....................START........................



// login with device
app.post('/login_with_device',(req, res) => {
  
var username = req.body.username;
console.log(username);

// Data write in a textfile -> username
fs.writeFile('username.txt', username, (err) => {
              if (err) throw err;
              console.log('username written to username.txt file');
});
var password = req.body.password;
console.log(password);

var sess = req.session; 

//var u_name = 'saoreen';
//var u_pass = '12345';

var sql = 'SELECT u_name,password FROM test where u_name = ?';
connection.query(sql, [username], function (err, rows) {
  if (err) throw err;
  //console.log(result);

  rows.forEach(function(result) {
            console.log(result.u_name,result.password);
            //console.log(JSON.stringify(result.u_name));

        if(username === result.u_name && password ===result.password ){
        
        //setting session id
        req.session.userId = result.u_name;
        req.session.loggedin = true;

        var v = "1";
        res.send({value: v});
        }else{

        if(username !== result.u_name ){
        var v = "2";   
        res.send({value: v});
        }

        if(password !== result.password){
        var v = "3";
        res.send({value: v});
        }
    }
        })
});

}); // end of app.post function
// end of login with token


//*************************************
//*************************************
//*************************************



// onload username at each page
//after_login.html, add_resource.html, view_resoource.html
app.get('/load_username',(req, res) => {

    var user_name = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/username.txt', 'utf8');
    console.log(user_name.toString());
  
  //select based on u_name
var sql = "SELECT name FROM test where u_name = ? ";
connection.query(sql, [user_name], function (err, rows) {
  if (err) throw err;
  console.log('Data received from test:');

  rows.forEach(function(result) {
            console.log(result.name);

            //Data write user_name.txt
            writeFile = fs.openSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/user_name.txt', 'w');
            fs.writeSync(writeFile, result.name);
            console.log('Successfully written in user_name.txt file');
            fs.close(writeFile);

            res.send({name: result.name });

  
        })

});

});
//End load_username

//*************************************
//*************************************
//*************************************



// get_policy_attribute_info from CAs DB
//view_resource_single_page.html
app.post('/get_policy_attribute_info',(req, res) => {

/*
//get row count from CAs table
var sql_row_count = "select count(attribute_id) from CAs";
connection.query(sql_row_count, function (err, rows) {
  if (err) throw err;
  console.log(rows);
  console.log('row numbers received from CAs:');
  rows.forEach(function(result) {
            console.log(result);
            res.send({row_count: result});
  
        })
  

});
*/

  var attribute_name = req.body.attribute_name;
  console.log(attribute_name);

  //select based on u_name
  var sql = "SELECT * FROM CAs where attribute_name = ? ";
//var sql = "SELECT * FROM CAs ";
connection.query(sql,[attribute_name], function (err, rows) {
  if (err) throw err;
  console.log('Data received from CAs:');

  rows.forEach(function(result) {
            console.log(result.attribute_name);
            console.log(result.attribute_desc);
            res.send({name: result.attribute_name,  desc: result.attribute_desc});
  
        })

});

});
//End get_policy_attribute_info

//*************************************
//*************************************
//*************************************


// get_list_of_policy_attributes from CAs DB
//add_resource_metadata.html
app.post('/get_list_of_policy_attributes',(req, res) => {

//var attribute_name = "age";
//select based on u_name
//var sql = "SELECT * FROM CAs where attribute_name = ? ";
var sql = "SELECT * FROM CAs ";
connection.query(sql, function (err, result) {
    if (err) throw err;

    console.log(result[0].attribute_name);
    console.log(result[1].attribute_name);
    //res.send({name1 : result[0].attribute_name , name2 : result[1].attribute_name})
    res.json(result); 
    //console.log(result[1]);
    //res.send({name0: result[0].attribute_name , desc0: result[0].attribute_desc , name1: result[1].attribute_name, desc1: result[1].attribute_desc});
    
    
  });

});
//End get_list_of_policy_attributes



//*************************************
//*************************************
//*************************************


// create create_cpabe_metadata (add_resource_metadata.html)
//create confedential_resource_information.txt file in cpabe_ro folder and encrypt it with cpabe sk.
app.post('/create_cpabe_metadata',(req, res) => {

    var link = req.body.link;
    var key = req.body.key;
    var policy = req.body.policy;
    var name = req.body.name;
    var type = req.body.type;
    console.log(link);

    

    // Data write in text file ->resource/resource name
    writeFile = fs.openSync('/home/rimjhim/front_end/JWT_token/token_simplify/cpabe_ro/resource/resource_name.txt', 'w');
    fs.writeSync(writeFile, name);
    //console.log('Successfully written in text file');
    fs.close(writeFile);

    // Data write in text file -> resource/resource type
    writeFile = fs.openSync('/home/rimjhim/front_end/JWT_token/token_simplify/cpabe_ro/resource/resource_type.txt', 'w');
    fs.writeSync(writeFile, type);
    //console.log('Successfully written in text file');
    fs.close(writeFile);

    policy_write = "'"+policy+"'";
    // Data write in text file -> resource/resource policy
    writeFile = fs.openSync('/home/rimjhim/front_end/JWT_token/token_simplify/cpabe_ro/resource/resource_policy.txt', 'w');
    fs.writeSync(writeFile, policy_write);
    //console.log('Successfully written in text file');
    fs.close(writeFile);

    const resource_information = 'Resource Name: ' + name + '\n' + 'Resource Type: '+ type + '\n' + 'Resource Source Link: '+ link +'\n' + 'Password: ' + key;

    // Data write in text file
    writeFile = fs.openSync('/home/rimjhim/front_end/JWT_token/token_simplify/cpabe_ro/resource_information.txt', 'w');
    fs.writeSync(writeFile, resource_information);
    //console.log('Successfully written in text file');
    fs.close(writeFile);

    // Data write in text file
    writeFile = fs.openSync('/home/rimjhim/front_end/JWT_token/token_simplify/cpabe_ro/confedential_resource_information.txt', 'w');
    fs.writeSync(writeFile, resource_information);
    //console.log('Successfully written in text file');
    fs.close(writeFile);


    //var file = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/command.txt', 'utf8');
    var file = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/cpabe_ro/confedential_resource_information.txt', 'utf8');
    //console.log(file.toString());


    if(file.length != 0){
        
    //Encrypting CPABE metadata.txt
    shell.cpabe_encryption();

    var cpabe_matadata = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/cpabe_ro/confedential_resource_information.txt.cpabe', 'utf8');
    //console.log(cpabe_matadata.toString());

    //condition check
    if(cpabe_matadata.length != 0){


    // copy cpabe_ro->cpabe
    fs.copyFile("/home/rimjhim/front_end/JWT_token/token_simplify/cpabe_ro/confedential_resource_information.txt.cpabe", '/home/rimjhim/front_end/JWT_token/token_simplify/cpabe/confedential_resource_information.txt.cpabe', (err) => {
    if (err) throw err;
    //console.log('File was copied to destination');
    });

    // copy cpabe_ro->cpabe_ro/resource
    fs.copyFile("/home/rimjhim/front_end/JWT_token/token_simplify/cpabe_ro/confedential_resource_information.txt.cpabe", '/home/rimjhim/front_end/JWT_token/token_simplify/cpabe_ro/resource/confedential_resource_information.txt.cpabe', (err) => {
    if (err) throw err;
    //console.log('File was copied to destination');
    });

    //const myURLs = [new URL('http://localhost:4000/add_resource.html')];
    //console.log(JSON.stringify(myURLs));
    //res.send(myURLs);
    res.send('yes');
    }
    
    }

    if(file.length == 0){
        res.send('no');
    }
    



});
//End create_cpabe_metadata

//*************************************
//*************************************
//*************************************


// create cpabe_metadata_decryption (view_resource_single_page.html)
//decrept confedential_resource_information.txt file in cpabe_rr folder and decrypt it with cpabe sk.
app.post('/cpabe_metadata_decryption',(req, res) => {

    //var file = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/command.txt', 'utf8');
    var file = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/cpabe_ro/confedential_resource_information.txt.cpabe');
    //console.log(file.toString());
    
    if(file.length != 0){

    //Decrypting CPABE metadata.txt
    shell.cpabe_decryption();
    
    var cpabe_matadata = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/cpabe/confedential_resource_information.txt', 'utf8');
    //console.log(cpabe_matadata.toString());

    //condition check
    if(cpabe_matadata.length != 0){
    //res.send('yes');
    res.send(cpabe_matadata);
    }
    
    }

    if(file.length == 0){
        res.send('no');
    }
    

});
//End cpabe_metadata_decryption

//*************************************
//*************************************
//*************************************



// confirm_metadata (add_resource_metadata.html)
//confirm the creation of cpabe_metdata in order to proceed in the next ppage
app.get('/confirm_metadata',(req, res) => {
    

    var cpabe_matadata = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/cpabe_ro/confedential_resource_information.txt.cpabe', 'utf8');
    //console.log(cpabe_matadata.toString());

    if(cpabe_matadata.length != 0){

    const myURLs = [new URL('http://localhost:4000/add_resource.html')];
    //console.log(JSON.stringify(myURLs));
    res.send({value: "yes", page_link: myURLs});
    }

    if(cpabe_matadata.length == 0){
        res.send({value: "no"});
    }
    

});
//End confirm_metadata

//*************************************
//*************************************
//*************************************

// onload username at each page
//after_login.html, add_resource.html, view_resoource.html
app.get('/pageload_add_resource',(req, res) => {

    var user_name = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/username.txt', 'utf8');
    console.log(user_name.toString());
  
  //select based on u_name
var sql = "SELECT name FROM test where u_name = ? ";
connection.query(sql, [user_name], function (err, rows) {
  if (err) throw err;
  var auth = "true";
  console.log('Data received from test:');

  rows.forEach(function(result) {
            //console.log(result.name);

            //read resource name from resoure/resource_name.txt file
            var resource_name = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/cpabe_ro/resource/resource_name.txt', 'utf8');
            //read resource type from resoure/resource_type.txt file
            var resource_type = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/cpabe_ro/resource/resource_type.txt', 'utf8');

            res.send({name: result.name, resource_name: resource_name,resource_type:resource_type });
  
        })

});

});
//End pageload_add_resource

//*************************************
//*************************************
//*************************************


//add_resource page
app.post('/add_resource',(req, res)=>{

// getting file name which was uploaded in the web and then read those file and perse into json object
// current version goes for static file read
var file1 = req.body.file1;
console.log(file1);

var file2 = req.body.file2;
console.log(file2);

var file3 = req.body.file3;
console.log(file3);


//reading properties of a resource from properties.json
var json_String = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/cpabe_ro/resource/properties.json');
var jsonString= JSON.parse(json_String);
//console.log(jsonString);
//console.log(jsonString.OName);

    info1 = jsonString.Oid;
    info2 = jsonString.OName;
    info3 = jsonString.OPublishDate;
    info4 = jsonString.O_Owner;
    info5 = jsonString.ODesc;
    info6 = jsonString.Otype;
    info7 = jsonString.OPrimaryDesc;
    info8 = jsonString.OCategory;

    var oid = info1;
    var prop = info2 + '\n' + info3 + '\n' + info4 + '\n' + info5 + '\n' + info6 + '\n' + info7 + '\n' + info8;
    var cert = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/cpabe_ro/resource/certificate.crt').toString();
    var metadata = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/cpabe_ro/resource/confedential_resource_information.txt.cpabe').toString();
    var policy = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/cpabe_ro/resource/resource_policy.txt', 'utf8');
    


//EC Signature Generation
console.log("generate ec signature");
//lib_client.ec_sig_gen_for_add_resource(name, type, prop, cert, metadata);

lib_client.ec_sig_gen_for_add_resource(1, 2, 3, 4, 5);


//EC Signature Verification
console.log("verify ec signature");


console.log("reading verification from output");
var output = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/EC/EC_Server/verification.txt', 'utf8');
//console.log(output);

val = output.toString();
var strTrim = val.trim();
console.log('output of files',strTrim)

//EC Signature verification check
if (strTrim == "Verification OK"){
console.log("Valid Signature when verification done");


// Library Imports
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction;

// Connection Initialization
const rpcURL = "HTTP://127.0.0.1:7545";
const web3 = new Web3(rpcURL);

var user_account = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/user_account.json');
var user_acc= JSON.parse(user_account);
//var user_acc = '0x437F3F5C3E291E1334D3293D4F88cE374051bd60';


//oPRop_ACC combine SC parameters
//var contractAddress = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oProp_ACC_combine_account_address.json');
//var contractAddress= JSON.parse(contractAddress);
var contractAddress = '0x568f3Cd4659f1EC96e21e538fCAE003b1aa4213D';


var ABI = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oProp_ACC_combine_SC_ABI.json');
var abi= JSON.parse(ABI);
//oPRop parameters end


//Function call oProp_ACC_combine
var contractInstance = new web3.eth.Contract(abi, contractAddress);
//console.log(contractInstance1);
    const gas_ammount = 5000000;

    //function call
    contractInstance.methods.registerInfo(oid,prop,cert,policy,metadata).send({from: user_acc, gas: gas_ammount})
    .on('transactionHash', function(hash){
        console.log(hash);

if( 0 !== hash.length){
//console.log("Successful Submission oProp!!");


//o_Dir contract account
var contractAddress_oDir = '0x31c2185e3C507c5416D90a2E699b92E247A3415a';
//var contractAddress_oDir = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oDir_contract_address.json');
//var contractAddress_oDir= JSON.parse(contractAddress_oDir);


var ABI_oDir = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oDir_abi.json');
var abi_oDir = JSON.parse(ABI_oDir);

var contractInstance_oDir = new web3.eth.Contract(abi_oDir, contractAddress_oDir);

    var BA_account = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/BA_account.json');
    var BA_acc= JSON.parse(BA_account);
    //var BA_acc = "0x437F3F5C3E291E1334D3293D4F88cE374051bd60";

    //function call
    contractInstance_oDir.methods.registerdata(info1,info2,info3,info4,info5,info6,info7,info8).send({from: BA_acc, gas: gas_ammount})
    .on('transactionHash', function(hash){
        console.log(hash);
        if( 0 !== hash.length){
        console.log("Successful Submission o_Dir!!");
        res.send("yes");
      }

      if( 0 == hash.length){
        console.log("Error!! Please Try Again");
        res.send("no1");
      }

    }); // End oDir function Call
        
      }

      if( 0 == hash.length){
        //console.log("Error!! Please Try Again");
        res.send("no2");
      }

}); // End oProp SC function call




/*
// Properties: Json file read
const properties = {
    Oid: "12345",
    OName: "Toms Trip To Moon", 
    OPublishDate: "16 Oct 2021",
    O_Owner: "Saoreen rahman",
    ODesc: "Toms Trip to Moon is a story of a child who dreams to travel to moon someday.",
    Otype: "Movie",
    OPrimaryDesc: "Video Quality: HD, Size: 16MB",
    OCategory: "Cartoon",
}


// Data write in a json -> oProp contract account
        writeFile = fs.openSync('properties.json', 'w');
        fs.writeSync(writeFile, JSON.stringify(properties));
        console.log('Successfully wrote file');
        fs.close(writeFile);
*/


}

else{
    console.log("Invalid Signature");
    res.send("Invalid Signature");
    }



});
//End add_resource

//*************************************
//*************************************
//*************************************


//view_resource.html-> oDir getdata() function call
//during onload, this function is called
app.get('/view_resource_onload',(req, res) => {




// Library Imports
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction;

// Connection Initialization
const rpcURL = "HTTP://127.0.0.1:7545";
const web3 = new Web3(rpcURL);


//o_Dir contract account
var contractAddress_oDir = '0x31c2185e3C507c5416D90a2E699b92E247A3415a';
//var contractAddress_oDir = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oDir_contract_address.json');
//var contractAddress_oDir= JSON.parse(contractAddress_oDir);


var ABI_oDir = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oDir_abi.json');
var abi_oDir = JSON.parse(ABI_oDir);

var contractInstance_oDir = new web3.eth.Contract(abi_oDir, contractAddress_oDir);


//call oDir smart contract function
    contractInstance_oDir.methods.getdata().call().then(function(result) { 
    //console.log("List of Objects: ", result[3]);
    
    console.dir(result);

    var name_of_user = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/user_name.txt', 'utf8');
    

    res.send({name: name_of_user.toString(), resource0_name: result[0][0].toString(), resource0_id: result[0][1].toString(), resource0_type: result[0][2].toString(), resource0_date: result[0][3].toString(), resource0_category: result[0][4].toString(),resource1_name: result[1][0].toString(), resource1_id: result[1][1].toString(), resource1_type: result[1][2].toString(), resource1_date: result[1][3].toString(), resource1_category: result[1][4].toString(), resource2_name: result[2][0].toString(), resource2_id: result[2][1].toString(), resource2_type: result[2][2].toString(), resource2_date: result[2][3].toString(), resource2_category: result[2][4].toString(), resource3_name: result[3][0].toString(), resource3_id: result[3][1].toString(), resource3_type: result[3][2].toString(), resource3_date: result[3][3].toString(), resource3_category: result[3][4].toString()});

  });




});
// End view_resource_onload

//*************************************
//*************************************
//*************************************




//view_resource.html-> Details button -> oDir indexdata() function call
app.post('/view_resource_details_button',(req, res) => {

var index = req.body.index;
//console.log(index);


//Ring Signature Generation
console.log("generate ring signature");
lib_client.ring_sig_gen_for_view_resource(index);

//Ring Signature Verification
console.log("verify ring signature");
lib.ring_sig_verify();


console.log("reading verification from output");
var output = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/Ring/Ring_Server/verification.txt', 'utf8');
//console.log(output);

    //res.send(output.toString());
    val = output.toString();

    var strTrim = val.trim();
       console.log("context of output file",strTrim)

if (strTrim == "1"){
     console.log("Valid Signature after verification");


// Library Imports
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction;

// Connection Initialization
const rpcURL = "HTTP://127.0.0.1:7545";
const web3 = new Web3(rpcURL);

//o_Dir contract account
var contractAddress_oDir = '0x31c2185e3C507c5416D90a2E699b92E247A3415a';
//var contractAddress_oDir = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oDir_contract_address.json');
//var contractAddress_oDir= JSON.parse(contractAddress_oDir);


var ABI_oDir = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oDir_abi.json');
var abi_oDir = JSON.parse(ABI_oDir);

var contractInstance_oDir = new web3.eth.Contract(abi_oDir, contractAddress_oDir);


//call oDir smart contract function
    contractInstance_oDir.methods.indexdata(index).call().then(function(result) { 
    console.log("Resource: ", result[1]);
    
    console.dir(result);

    // Data write in a json -> acc contract account
        writeFile = fs.openSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oDir_resource_id.json', 'w');
        fs.writeSync(writeFile, JSON.stringify(result[1]));
        console.log('obj_id written to oDir_resource_id.json file');
        fs.close(writeFile);

    const myURLs = [new URL('http://localhost:4000/view_resource_single_page.html')];
    res.send({id: result[1].toString(), page_link: myURLs});

  });

}
else{
    res.send("Invalid Signature");
    }


});
//End view_resource_details_button -> oDir indexdata() function call -> view_resource.html

//*************************************
//*************************************
//*************************************


//single_resource.html-> oDir getdataInfo() function call
//load during pageload
app.post('/view_single_resource_info',(req, res) => {

// Library Imports
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction;

// Connection Initialization
const rpcURL = "HTTP://127.0.0.1:7545";
const web3 = new Web3(rpcURL);

//............o_Dir SC START....................
//o_Dir contract account
var contractAddress_oDir = '0x31c2185e3C507c5416D90a2E699b92E247A3415a';
//var contractAddress_oDir = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oDir_contract_address.json');
//var contractAddress_oDir= JSON.parse(contractAddress_oDir);

var ABI_oDir = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oDir_abi.json');
var abi_oDir = JSON.parse(ABI_oDir);

var contractInstance_oDir = new web3.eth.Contract(abi_oDir, contractAddress_oDir);
//..........o_Dir SC End..............

//..........OPRopACC START............
//oPRop_ACC combine SC parameters
//var contractAddress = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oProp_ACC_combine_account_address.json');
//var contractAddress= JSON.parse(contractAddress);
var contractAddress = '0x568f3Cd4659f1EC96e21e538fCAE003b1aa4213D';


var ABI = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oProp_ACC_combine_SC_ABI.json');
var abi= JSON.parse(ABI);
//oPRop parameters end


//Function call oProp_ACC_combine
var contractInstance = new web3.eth.Contract(abi, contractAddress);


//..........OPRopACC END..............


//reading resource id
var resource_id = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oDir_resource_id.json');
var Rid= JSON.parse(resource_id);

//var rid = "12345";


//call oDir smart contract function
    contractInstance_oDir.methods.getdataInfo(Rid).call().then(function(result) { 
    console.log("getdataInfo: ", result);
    //console.dir(result);


//cal OPROPACC smart contract function and read certificate
    contractInstance.methods.getInfo(Rid).call().then(function(output) { 
    console.log("getPropertyInfo: ", output[2]);
    console.dir(output);

    // Data write in a json -> acc contract account
    //    writeFile = fs.openSync('/home/rimjhim/front_end/JWT_token/token_simplify/certificate/resource_certificate.crt', 'w');
    //    fs.writeSync(writeFile, JSON.stringify(output[1].toString()));
    //    console.log('obj_certificate written in certificate/resource_certificate.crt file');
    //    fs.close(writeFile);

if( Rid === '12345' ){
    val = 0;
}

if( Rid === '67890' ){
    val = 1;
}

if( Rid === '114567' ){
    val = 2;
}

if( Rid === '56987' ){
    val = 3;
}


  console.dir("begin of python code");
  const { spawn } = require('child_process');

  //const pyProg = spawn('python', ['/home/rimjhim/front_end/JWT_token/token_simplify/certificate/certificate_read_all.py', val]);
  const pyProg = spawn('python', ['/home/rimjhim/front_end/JWT_token/token_simplify/certificate_read_all.py', val]);
    
  pyProg.stdout.on('data', function(data) {
        
        var name_of_user = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/user_name.txt', 'utf8');
    
        console.log(name_of_user);
        //res.send({resource0_policy: output[2].toString(), resource0_metadata: output[0].toString(), resource0_cert: data.toString()});
        //res.send({resource0_metadata: output[0].toString()});
        res.send({resource0_name: result[0].toString(), resource0_type: result[1].toString(), resource0_date: result[2].toString(), resource0_category: result[3].toString(), resource0_property: result[4].toString(), resource0_desc: result[5].toString(), resource0_owner: result[6].toString(), resource0_id: Rid, resource0_policy: output[2].toString(), resource0_metadata: output[0].toString(), resource0_cert: data.toString(), name: name_of_user.toString()});
    
  
    }); //python code end
 }); //opropacc sc end


  }); //o_Dir sc end


}); 
// End view_single_resource_info

//*************************************
//*************************************
//*************************************


//view_resource_single_page.html-> oDir and oPropACC SC function call
//show both resource policy, certificate and cpabe metadata
app.post('/view_resource_policy_cert',(req, res) => {


//reading resource id
var resource_id = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oDir_resource_id.json');
var Rid= JSON.parse(resource_id);
//var Rid = '12345';



// Library Imports
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction;

// Connection Initialization
const rpcURL = "HTTP://127.0.0.1:7545";
const web3 = new Web3(rpcURL);

//oPRop_ACC combine SC parameters
//var contractAddress = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oProp_ACC_combine_account_address.json');
//var contractAddress= JSON.parse(contractAddress);
var contractAddress = '0x568f3Cd4659f1EC96e21e538fCAE003b1aa4213D';


var ABI = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oProp_ACC_combine_SC_ABI.json');
var abi= JSON.parse(ABI);
//oPRop parameters end


//Function call oProp_ACC_combine
var contractInstance = new web3.eth.Contract(abi, contractAddress);



//call oProp_ACC_combine smart contract function
    contractInstance.methods.getInfo(Rid).call().then(function(output) { 
    console.log("getPropertyInfo: ", output[2]);
    //console.dir(output);

    // Data write in a json -> acc contract account
        writeFile = fs.openSync('/home/rimjhim/front_end/JWT_token/token_simplify/certificate/resource_certificate.crt', 'w');
        fs.writeSync(writeFile, JSON.stringify(output[1].toString()));
        console.log('obj_certificate written in certificate/resource_certificate.crt file');
        fs.close(writeFile);

if( Rid === '12345' ){
    val = 0;
}

if( Rid === '67890' ){
    val = 1;
}

if( Rid === '114567' ){
    val = 2;
}

if( Rid === '56987' ){
    val = 3;
}


  const { spawn } = require('child_process');
  const pyProg = spawn('python', ['/home/rimjhim/front_end/JWT_token/token_simplify/certificate_read_all.py', val]);
    
  pyProg.stdout.on('data', function(data) {
        
        res.send({resource0_policy: output[2].toString(), resource0_metadata: output[0].toString(), resource0_cert: data.toString()});
       
    });
 }).catch((e) => {
            console.log('error')
            res.send(JSON.stringify('error'));
            });


});
//End

//*************************************
//*************************************
//*************************************

// read certificate all info from  certificaate_info
//view_resource_single_page.html
app.post('/cert_all_info',(req, res) => {

    var certificate = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/certificate_info.txt', 'utf8');
    console.log(certificate.toString());
    res.send({cert: certificate.toString()});


});
//End cert_all_info

//*************************************
//*************************************
//*************************************



//support.html page
app.post('/misbehavior_submit',(req, res)=>{

var name = req.body.name;
console.log(name);

var id = req.body.id;
console.log(id);

var owner = req.body.owner;
console.log(owner);

var time = req.body.time;
console.log(time);

var desc = req.body.desc;
console.log(desc);

var user_account_address = "0xb6B271043C4C326589Dff50e64DE99958944c639";

//EC Signature Generation
console.log("generate ec signature");
//lib_client.ec_sig_gen_for_add_resource(name, type, prop, cert, metadata);

lib_client.ec_sig_gen_for_add_resource(1, 2, 3, 4, 5);


//EC Signature Verification
console.log("verify ec signature");


console.log("reading verification from output");
var output = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/EC/EC_Server/verification.txt', 'utf8');
//console.log(output);

val = output.toString();
var strTrim = val.trim();
console.log('output of files',strTrim)

//EC Signature verification check
if (strTrim == "Verification OK"){
console.log("Valid Signature when verification done");


// Library Imports
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction;

// Connection Initialization
const rpcURL = "HTTP://127.0.0.1:7545";
const web3 = new Web3(rpcURL);

var BA_account = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/BA_account.json');
var BA_acc= JSON.parse(BA_account);
//var BA_acc = "0xda7b5756D427684fcc504BBCc402ec4431b2F238";


//oPRop_ACC combine SC parameters
//var contractAddress_adj = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/ADJ_account_address.json');
//var contractaddress_adj= JSON.parse(contractAddress_adj);
var contractaddress_adj = '0x5901e4BF74a23A6d6A1Fe10f01A635E0B04bfF28';


var ABI_abj = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/ADJ_SC_ABI.json');
var abi_abj= JSON.parse(ABI_abj);
//oPRop parameters end


//Function call oProp_ACC_combine
var contractInstance_adj = new web3.eth.Contract(abi_abj, contractaddress_adj);
//console.log(contractInstance1);
    const gas_ammount = 5000000;

    //function call
    contractInstance_adj.methods.reportMisbehavior(user_account_address,id,owner,desc,time).send({from: BA_acc, gas: gas_ammount})
    .on('transactionHash', function(hash){
        console.log(hash);

if( 0 !== hash.length){
console.log("Successful Submission ADJ!!");
res.send("yes");
 }

      if( 0 == hash.length){
        console.log("Error!! Please Try Again");
        res.send("no");
      }

}); // End ADJ SC function call

}

else{
    console.log("Invalid Signature");
    res.send("Invalid Signature");
    }

});
//End misbehavior_submit

//*************************************
//*************************************
//*************************************


//......................END...................





