var express = require('express');
var app=express();
var bodyParser= require('body-parser');
var jwt=require('jsonwebtoken');
const fs = require('fs');
const Web3 = require('web3');
const fileUpload = require('express-fileupload');
var session = require('express-session');




const secret = 'secret';


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

/*
app.get('/', (req,res)=>{
    res.sendFile('login_v1.html');
});

app.get('/', (req,res)=>{
    res.sendFile('index_page1.html');
});

app.get('/', (req,res)=>{
    res.sendFile('profile.html');
});



app.get('/', (req,res)=>{
    res.sendFile('services_after_login_with_token.html');
});


// try add resource in one file
app.get('/', (req,res)=>{
    res.sendFile('add_resource_v2.html');
});


app.get('/', (req,res)=>{
    res.sendFile('browse_resource.html');
});

app.get('/', (req,res)=>{
    res.sendFile('single_resource_v1.html');
});

app.get('/', (req,res)=>{
    res.sendFile('edit_password.html');
});

app.get('/', (req,res)=>{
    res.sendFile('edit_personal_information.html');
});
*/

app.get('/', (req,res)=>{
    res.sendFile('index_main.html');
});

app.get('/', (req,res)=>{
    res.sendFile('login_main.html');
});

app.get('/', (req,res)=>{
    res.sendFile('after_login.html');
});

/*
//add resource
app.get('/', (req,res)=>{
    res.sendFile('add_resource.html');
}); */

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

/*
app.get('/', (req,res)=>{
    res.sendFile('add_resource_metadata.html');
});*/

/*
app.get('/', (req,res)=>{
    res.sendFile('add_resource_encrypt.html');
});*/

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
const shell = require("./lsExec");


//Encrypting CPABE metadata.txt
//shell.cpabe_encryption();

//Decrypting CPABE metadata.txt.cpabe
//shell.cpabe_decryption();


//./home/rimjhim/front_end/JWT_token/token_simplify/UI_Ring/AAS

//................................
// DB Connection
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


//*Final Version*//
//vImp
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


//*Final Version*//
//vImp
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


//*Final Version*//
//vImp
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

//*Final Version*//
//vImp
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

//*Final Version*//
//vImp
// create create_cpabe_metadata (add_resource_metadata.html)
//create confedential_resource_information.txt file in cpabe_ro folder and encrypt it with cpabe sk.
app.post('/create_cpabe_metadata',(req, res) => {

    var link = req.body.link;
    var key = req.body.key;
    var policy = req.body.policy;
    var name = req.body.name;
    var type = req.body.type;
    console.log(link);

    /*
    var json_String = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/cpabe_ro/resource/properties.json');
    var jsonString= JSON.parse(json_String);
    //console.log(jsonString);
    //console.log(jsonString.OName);

    name = jsonString.OName;
    type = jsonString.Otype; */

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

//*Final Version*//
//vImp
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


//*Final Version*//
//vImp
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

//*Final Version*//
//vImp
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

//Final Version
//vImp
//add_resource page
app.post('/add_resource',(req, res)=>{

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


//*vImp*/
//Final Version
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



//Final Version
//*vImp*//
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


//Final Version
//*vImp*//
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

//..........OPROPACC START............
//oPRop_ACC combine SC parameters
//var contractAddress = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oProp_ACC_combine_account_address.json');
//var contractAddress= JSON.parse(contractAddress);
var contractAddress = '0x568f3Cd4659f1EC96e21e538fCAE003b1aa4213D';


var ABI = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oProp_ACC_combine_SC_ABI.json');
var abi= JSON.parse(ABI);
//oPRop parameters end


//Function call oProp_ACC_combine
var contractInstance = new web3.eth.Contract(abi, contractAddress);


//..........OPROTACC END..............


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

//Final Version
//*Imp*//
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



//call oProp smart contract function
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

  //const pyProg = spawn('python', ['/home/rimjhim/front_end/JWT_token/token_simplify/certificate/certificate_read_all.py', val]);
  const pyProg = spawn('python', ['/home/rimjhim/front_end/JWT_token/token_simplify/certificate_read_all.py', val]);
    
  pyProg.stdout.on('data', function(data) {
        
        //console.log(data.toString());
        res.send({resource0_policy: output[2].toString(), resource0_metadata: output[0].toString(), resource0_cert: data.toString()});
        //res.send({resource0_metadata: output[0].toString()});
          //res.send({resource0_cert: data.toString()});
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

//*Final Version*//
//vImp
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


//Final Version
//vImp
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
//*vImp*//
// add_resource_v2.html -> reading certificate
app.post('/add_resource_with_oDir_v1',(req, res)=>{



var info = req.body.info;
//console.log(info);

var cert = req.body.cert;
//console.log(cert);

var desc = req.body.desc;
//console.log(desc);

var policy = req.body.policy;
//console.log(policy);

var metadata = req.body.metadata;
//console.log(metadata);


//EC Signature Generation
console.log("generate ec signature");
//lib_client.ec_sig_gen_for_add_resource(info, cert, desc, policy, metadata);

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


var desc1 = fs.readFileSync('/home/rimjhim/mysqlexperiment/cert_for_object/properties.txt').toString();
var cert1 = fs.readFileSync('/home/rimjhim/mysqlexperiment/cert_for_object/certificate.crt').toString();
var metadata1 = fs.readFileSync('/home/rimjhim/mysqlexperiment/cert_for_object/metadata/O_metadata.txt.cpabe').toString();



// Library Imports
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction;

// Connection Initialization
const rpcURL = "HTTP://127.0.0.1:7545";
const web3 = new Web3(rpcURL);

var user_account = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/user_account.json');
var user_acc= JSON.parse(user_account);


//oPRop parameters
//var oProp_contract_address = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oProp_contract_account.json');
//var oProp_contractAddress= JSON.parse(oProp_contract_address);
var oProp_contractAddress = '0x01F557aDF38285EA24f393FC2dea717B28F4f0DE';

//var ABI1 = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oProp_contract_abi_resource_single_page.json');
var ABI = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oprop_contract_setPropertyInfo_abi.json');
var abi= JSON.parse(ABI);
//oPRop parameters end

//.................

//ACC parameter Start
//var ACC_contract_address = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/acc_contract_account.json');
//var ACC_contractAddress= JSON.parse(ACC_contract_address);
var ACC_contractAddress = '0x11ee7e761ffC8f7412183280d97a7D434dE6a368';

var ABI1 = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/acc_contract_setAccessInfo_abi.json');
var abi1= JSON.parse(ABI1);

//ACC parameter End

//Function call oProp
var contractInstance = new web3.eth.Contract(abi, oProp_contractAddress);
//console.log(contractInstance1);
    const gas_ammount = 3000000;
   
    info1 = "12345";
    info2 = "desc1 + desc";
    info3 = "cert1";

    //function call
    contractInstance.methods.setPropertyInfo(info1,info2,info3).send({from: user_acc, gas: gas_ammount})
    .on('transactionHash', function(hash){
        console.log(hash);
        if( 0 !== hash.length){
        //alert("Successfully Added!!" + "\n" +"Transaction Hash:" + "\n" + hash);
        //alert("Successful Submission!!");
        //res.send("yes");
        console.log("Successful Submission oProp!!");

              //Function call ACC

var contractInstance2 = new web3.eth.Contract(abi1, ACC_contractAddress);
//console.log(contractInstance1);

  //user_acc= "0x6d143AbE33d94B5F2521b0309Bc7Aa28eC022C42";
  //console.log(acc);

    //const gas_ammount = 5000000;

    info1 = "12345";
    info2 = "policy";
    info3 = "metadata1";

    //function call
    contractInstance2.methods.addAccessInfo(info1,info2,info3).send({from: user_acc, gas: gas_ammount})
    .on('transactionHash', function(hash){
        console.log(hash);
        if( 0 !== hash.length){
        //alert("Successfully Added!!" + "\n" +"Transaction Hash:" + "\n" + hash);
        //alert("Successful Submission!!");
        //res.send("yes");
        console.log("Successful Submission ACC!!");

      res.send("yes");

      }

      if( 0 == hash.length){
        //alert("Error!! Please Try Again");
        console.log("Error!! Please Try Again");
        res.send("no1");
      }

}); // End ACC function Call

      }

      if( 0 == hash.length){
        //alert("Error!! Please Try Again");
        console.log("Error!! Please Try Again");
        res.send("no2");
      }

}); // End oProp SC function call

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


var json_String = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/properties.json');
var jsonString= JSON.parse(json_String);
console.log(jsonString);
console.log(jsonString.OName);
//

//contract account
var contractAddress3 = '0x69CD66985EF7bbC8E0CB50cd1D5468736E594cE2';
//var contract_address3 = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oDir_contract_address.json');
//var contractAddress3= JSON.parse(contract_address3);


var ABI = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oDir_getdata_abi.json');
var abi3= JSON.parse(ABI);

var contractInstance3 = new web3.eth.Contract(abi3, contractAddress3);

    info1 = jsonString.Oid;
    info2 = jsonString.OName;
    info3 = jsonString.OPublishDate;
    info4 = jsonString.O_Owner;
    info5 = jsonString.ODesc;
    info6 = jsonString.Otype;
    info7 = jsonString.OPrimaryDesc;
    info8 = jsonString.OCategory;

    //function call
    contractInstance3.methods.registerdata(info1,info2,info3,info4,info5,info6,info7,info8).send({from: user_acc, gas: gas_ammount})
    .on('transactionHash', function(hash){
        console.log(hash);
        if( 0 !== hash.length){
        //alert("Successfully Added!!" + "\n" +"Transaction Hash:" + "\n" + hash);
        //alert("Successful Submission!!");
        //res.send("yes");
        console.log("Successful Submission ACC!!");
      }

      if( 0 == hash.length){
        console.log("Error!! Please Try Again");
      }

}); // End oDir function Call

}
else{
    console.log("Invalid Signature");
    res.send("Invalid Signature");
    }



});
//End add_resource_v1


//.............................................
//.............................................
//..............................................


//*vImp*//
//browse_resource.html-> Details button -> oDir indexdata() function call
app.post('/view_resource_oDir_getdata_details_v1',(req, res) => {

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

//var contractAddress3 = '0x725844644b9fC50898FDF02DefFF8dBca52405BE';
var contract_address3 = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oDir_contract_address.json');
var contractAddress3= JSON.parse(contract_address3);


var ABI = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oDir_getdata_abi.json');
var abi3= JSON.parse(ABI);



var contractInstance3 = new web3.eth.Contract(abi3, contractAddress3);
//console.log(contractInstance3);

//call oDir smart contract function
    contractInstance3.methods.indexdata(index).call().then(function(result) { 
    console.log("Resource: ", result[1]);
    
    console.dir(result);

    // Data write in a json -> acc contract account
        writeFile = fs.openSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oDir_getdata_obj_id.json', 'w');
        fs.writeSync(writeFile, JSON.stringify(result[1]));
        console.log('obj_id written to oDir_getdata_obj_id.json file');
        fs.close(writeFile);

    const myURLs = [new URL('http://localhost:4000/single_resource.html')];
    console.log(JSON.stringify(myURLs));
    //res.send(JSON.stringify(myURLs));    
    //res.send(result[1].toString());
    res.send({id: result[1].toString(), page_link: myURLs});

  });

}
else{
    res.send("Invalid Signature");
    }


});
//End Details button -> oDir indexdata() function call


//.............................................
//.............................................
//..............................................

//*vImp*//
//single_resource.html-> oACC and oPropRep function call
//show both resource policy, certificate and cpabe metadata
app.post('/view_ACC_v1',(req, res) => {


//reading resource id
var resource_id = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oDir_getdata_obj_id.json');
var Rid= JSON.parse(resource_id);
//var Rid = '12345';

//Ring Signature Generation
console.log("generate ring signature");
lib_client.ring_sig_gen_for_view_specific_resource(Rid);

//Ring Signature Verification
console.log("verify ring signature");
lib.ring_sig_verify_rid();


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

//start oProp cntract info
var contractAddress5 = '0x24630345D865B26f54AFaD999d6740EF18FeB6E0';
//var contract_address5 = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oProp_contract_address_resource_single_page.json');
//var contractAddress5= JSON.parse(contract_address5);

//ABI for oProp
var ABI5 = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oProp_contract_abi_resource_single_page.json');
var abi5= JSON.parse(ABI5);

var contractInstance5 = new web3.eth.Contract(abi5, contractAddress5);
//console.log(contractInstance5);
//..end oProp contract info


//call oProp smart contract function
    contractInstance5.methods.getPropertyInfo(Rid).call().then(function(output) { 
    console.log("getPropertyInfo: ", output);
    //console.dir(output);

    // Data write in a json -> acc contract account
        writeFile = fs.openSync('resource_certificate.crt', 'w');
        fs.writeSync(writeFile, JSON.stringify(output[1].toString()));
        console.log('obj_certificate written in resource_certificate.crt file');
        fs.close(writeFile);

    
    //res.send({resource0_metadata: result[0].toString(), resource0_policy: result[1].toString(), resource0_prop: output[0].toString(), resource0_cert: output[1].toString()});
  });




var contractAddress4 = '0x33B5a63532771083dEAC8A5A2a4025fa9F37fca9';
//var contract_address4 = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/ACC_contrate_address_resource_single_page.json');
//var contractAddress4= JSON.parse(contract_address4);


//ABI for ACC;
var ABI4 = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/ACC_contrate_abi_resource_single_page.json');
var abi4= JSON.parse(ABI4);



var contractInstance4 = new web3.eth.Contract(abi4, contractAddress4);
//console.log(contractInstance3);

//reading resource id
var resource_id = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oDir_getdata_obj_id.json');
var Rid= JSON.parse(resource_id);
//var Rid = '0xCBD8F600337F119112584C2A38BDE7166410A84277B40D5BD9DD58AE94B24371';


//call oDir smart contract function
    contractInstance4.methods.getAccInfoMultiple(Rid).call().then(function(result) { 
    console.log("getAccessInfo: ", result);
    
    //console.dir(result);

var age = result[1].toString();
var preference = result[3].toString();
var club_member= result[5].toString();

var condition1 = result[2].toString();
var condition2 = result[4].toString();

var policy_parameter1 = "User's age should be" + " " +age;
var policy_parameter2 = "User may be a " + " " + preference + " " +"client";
var policy_parameter3 = "User is a member of " + " " + club_member;

if( preference === "null" || preference === "N/A" || preference === "n/a" || preference === "0" ){
    
    var policy_parameter2 = " ";
    var condition1 = " ";
    var policy_parameter3 = " ";
    var condition2 = " ";

}

if( club_member === "null" || club_member === "N/A" || club_member === "n/a" ||club_member === "0" ){
    
    var policy_parameter3 = " ";
    var condition2 = " ";

}
 
 //reading resource id
//var resource_id = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/oDir_getdata_obj_id.json');
//var Rid= JSON.parse(resource_id);
 //val = 0;
   //Rid = 12345;

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
  //const pyProg = spawn('python', ['/home/rimjhim/front_end/JWT_token/token_simplify/certificate_read_all.py']);
    
  pyProg.stdout.on('data', function(data) {
        
        console.log(data.toString());
        res.send({resource0_policy1: policy_parameter1, resource0_policy2: condition1, resource0_policy3: policy_parameter2, resource0_policy4: condition2 , resource0_policy5: policy_parameter3, resource0_cert: data.toString()});
        //res.send({resource0_cert: data.toString()});
        
    });



  }).catch((e) => {
            console.log('error')
            res.send(JSON.stringify('error'));
            });

}
else{
    res.send("Invalid Signature");
    }


});
//End

//........................................
//........................................
//........................................




// SC deploy with signature
//deploy contract ACC
//app.post('/ACC_deploy',authJWT,(req, res)=>{
app.post('/ACC_deploy',(req, res)=>{

//console.log(req.body);

var account = req.body.account;
//console.log(account);

var bytecode = req.body.bytecode;
//console.log(bytecode);

var abi = JSON.parse(req.body.abi);
//console.log(abi);


//const lib = require("./deploy.js");

//const result = lib.acc_deploy();
//console.log(result);

// Library Imports
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction;

// Connection Initialization
const rpcURL = "HTTP://127.0.0.1:7545";
const web3 = new Web3(rpcURL);

// Data write in a textfile -> account
fs.writeFile('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/acc_account.txt', account, (err) => {
              if (err) throw err;
              console.log('account written to acc_account.txt file');
});

// Data write in a json -> bytecode
writeFile = fs.openSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/user_account.json', 'w');
  fs.writeSync(writeFile, JSON.stringify(account));
  console.log('bytecode written to abi.json file');
  fs.close(writeFile);


// Data write in a textfile -> bytecode
fs.writeFile('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/acc_bytecode.txt', bytecode, (err) => {
              if (err) throw err;
              console.log('bytecode written to bytecode.txt file');
});

// Data write in a json -> bytecode
writeFile = fs.openSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/acc_byte_code.json', 'w');
  fs.writeSync(writeFile, JSON.stringify(bytecode));
  console.log('bytecode written to abi.json file');
  fs.close(writeFile);

// Data write in a textfile -> abi
var abi_data = JSON.stringify(abi);
fs.writeFile('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/acc_abi.txt', abi_data, (err) => {
              if (err) throw err;
              console.log('bytecode written to acc_abi.txt file');
});

// Data write in a json -> abi
writeFile = fs.openSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/acc_abi.json', 'w');
  fs.writeSync(writeFile, JSON.stringify(abi));
  console.log('abi written to abi.json file');
  fs.close(writeFile);

//fs.close(file_descriptor);
var ABI = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/acc_abi.json');
var parsed= JSON.parse(ABI);
//var _abi = parsed;



//Contract object and account info
let deploy_contract = new web3.eth.Contract(abi);


// Function Parameter
let payload = {
    data: bytecode
}

let parameter = {
    from: account,
    gas: 9000000
}


// signature generation
    val = 1
    console.log('read python file ec_sign_gen')
    const { spawn } = require('child_process');
    const pyProg = spawn('python', ['/home/rimjhim/front_end/JWT_token/token_simplify/UI_Ring/ec_sign_gen.py', val]);
    //const pyProg = spawn('python', ['/home/rimjhim/front_end/JWT_token/token_simplify/UI_Ring/ec_sign_gen_backup.py', val]);
    //const pyProg = spawn('python', ['/home/rimjhim/front_end/JWT_token/token_simplify/UI_Ring/hello.py']);

    pyProg.stdout.on('data', function(data) {
        
        console.log(data.toString());

        if(data.toString() !== '1'){
            var output = 1;
            //console.log(output)
            
            // Function Call
            console.log('Contract Deploy acc')
            deploy_contract.deploy(payload).send(parameter, (err, transactionHash) => {
            console.log('Transaction Hash :', transactionHash);
            //res.send(JSON.stringify(transactionHash));
            }).on('confirmation', () => {}).then((newContractInstance) => {
            console.log('Deployed Contract Address : ', newContractInstance.options.address);
            res.send(JSON.stringify(newContractInstance.options.address));
            // Data write in a textfile -> bytecode
            fs.writeFile('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/acc_address.txt', newContractInstance.options.address, (err) => {
                if (err) throw err;              
            });
    
            }).catch((e) => {
            console.log('error')
            res.send(JSON.stringify('smart contract deploy fail'));
            });

        }else{
            var output = 0;
            console.log(output)
        }
    
    });

}); //ACC_deploy function end 
//deploy contract ACC

//...................................

// SC deploy with signature
//app.post('/oProp_deploy',authJWT,(req, res)=>{
app.post('/oProp_deploy',(req, res)=>{

//console.log(req.body);

var account = req.body.account;
//console.log(account);

var bytecode = req.body.bytecode;
//console.log(bytecode);

var abi = JSON.parse(req.body.abi);
//console.log(abi);

//const lib = require("./deploy.js");

//const result = lib.acc_deploy();
//console.log(result);

// Library Imports
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction;

// Connection Initialization
const rpcURL = "HTTP://127.0.0.1:7545";
const web3 = new Web3(rpcURL);

// Data write in a textfile -> account
fs.writeFile('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oProp_account.txt', account, (err) => {
              if (err) throw err;
              console.log('account written to oProp_account.txt file');
});

// Data write in a textfile -> bytecode
fs.writeFile('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oProp_bytecode.txt', bytecode, (err) => {
              if (err) throw err;
              console.log('bytecode written to oProp_bytecode.txt file');
});


// Data write in a textfile -> abi
var abi_data = JSON.stringify(abi);
fs.writeFile('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oProp_abi.txt', abi_data, (err) => {
              if (err) throw err;
              console.log('bytecode written to oProp_abi.txt file');
});

// Data write in a json -> abi
writeFile = fs.openSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oProp_abi.json', 'w');
  fs.writeSync(writeFile, JSON.stringify(abi));
  console.log('abi written to oProp_abi.json file');
  fs.close(writeFile);


var ABI = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oProp_abi.json');
var parsed= JSON.parse(ABI);
//var _abi = parsed;


//Contract object and account info
let deploy_contract = new web3.eth.Contract(parsed);


// Function Parameter
let payload = {
    data: bytecode
}

let parameter = {
    from: account,
    gas: 9000000
}


// signature generation
    val = 0
    //console.log('read python file ec_sign_gen')
    const { spawn } = require('child_process');
    const pyProg = spawn('python', ['/home/rimjhim/front_end/JWT_token/token_simplify/UI_Ring/ec_sign_gen.py', val]);
    //const pyProg = spawn('python', ['/home/rimjhim/front_end/JWT_token/token_simplify/UI_Ring/ec_sign_gen_backup.py', val]);
    //const pyProg = spawn('python', ['/home/rimjhim/front_end/JWT_token/token_simplify/UI_Ring/hello.py']);

    pyProg.stdout.on('data', function(data) {
        
        console.log(data.toString());

        if(data.toString() !== '1'){
            var output = 1;
            console.log(output)
            
            
            // Function Call
            console.log('Contract Deploy oProp')
            deploy_contract.deploy(payload).send(parameter, (err, transactionHash) => {
            console.log('Transaction Hash :', transactionHash);
            //res.send(JSON.stringify(transactionHash));
            }).on('confirmation', () => {}).then((newContractInstance) => {
            console.log('Deployed Contract Address : ', newContractInstance.options.address);
            res.send(JSON.stringify(newContractInstance.options.address));
            // Data write in a textfile -> bytecode
            fs.writeFile('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oProp_address.txt', newContractInstance.options.address, (err) => {
            if (err) throw err;              
            });
    
            }).catch((e) => {
            console.log('error')
            res.send(JSON.stringify('smart contract deploy fail'));
            });
            


        }else{
            var output = 0;
            console.log(output)
        }
      
    });

}); //oProp_deploy function end 

//..............................................



//*Imp*//
// login with token
//User Input Store (login page)
app.post('/login_with_token',(req, res) => {
  
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
        //Begin of token generation
        var message;
          
        var mess = "Error";

        var authentication = "true";
        var pk = "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEh8EgJNPxbvS7H31TtMVb9odR77zKIMD8EQrp+CFy7CHlUv9xurmorh8mUFr7sW+zXSZj2WEjQYxynOqNQnO5Lw==";
        //var nonce = "857231682911"
        var token=jwt.sign({ authentication: authentication, pk: pk},secret,{ expiresIn: '1440m' });
        //var token=jwt.sign({ authentication: authentication, pk: pk, nonce : nonce, expiresIn: '1440m' },secret);
            console.log(token);
            message="token generation successful";

            fs.writeFile('jwt_token.txt', token, (err) => {
              if (err) throw err;
              console.log('Data written to jwt_token.txt file');
            });
            var v = "1";
            res.send({value: v, token: token});

        // end verification function


        // send 
        //res.send({value: 1, token: token});
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

//..........................................

//*Imp*//
app.get('/logout',(req, res) => {
    console.log('logout request from browser');
    //var sess = req.session; 
    req.session.loggedin = false; 
    var authentication = "false";
    var token=jwt.sign({ authentication: authentication, sess: req.session.loggedin },secret,{ expiresIn: '1s' });  
    delete req.session.userId;
    req.session.destroy();
//    connection.end();
    console.log(authentication);
    //res.send({authentication: authentication, sess: sess});
    res.send(JSON.stringify(0));

    });


//......................................

//token verification by client side
// Token authentication by reading token from a text file
const token_authentication = (req, res, next)=>{
        // check header or url parameters or post parameters for token
        //console.log(req.body);
        var token = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/jwt_token.txt', 'utf8');
    console.log(token.toString());

        //var token = req.body.token || req.query.token || req.headers['x-access-token'];
        if(token){
          console.log("token");
          jwt.verify(token,secret,(err,decod)=>{
            if(err){
              res.status(403).json({
                message:"Wrong Token"
              });
            }
            else{
              console.log("success");
              req.decoded=decod;
              next();
            }
          });
        }
        else{
          res.status(403).json({
            message:"No Token"
          });
        }
}; // end of token authentication


//*Imp*//
//profile.html-> read and show data in classimax/profile.html
app.get('/profile_with_token',token_authentication,(req, res) => {

    var user_name = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/username.txt', 'utf8');
    console.log(user_name.toString());
  
  //select based on u_name
var sql = "SELECT * FROM test where u_name = ? ";
connection.query(sql, [user_name], function (err, rows) {
  if (err) throw err;
  var auth = "true";
  console.log('Data received from test:');

  rows.forEach(function(result) {
            console.log(result.u_name, result.name, result.email, result.address, result.contact_info, result.device_id, result.service_provider);
            //console.log(JSON.stringify(result.u_name));
            //res.send(result.u_name, result.name, result.email );
            res.send({username: result.u_name, name: result.name, email:result.email, address:result.address, contact_info:result.contact_info, device_id:result.device_id, service_provider:result.service_provider, token: auth});
  
        })

});

  //res.json(JSON.stringify(link));
  //res.send("link");
});
//End profile with token->load token and profile info all togather.


//.....................................................


//*Imp*/
//browse_resource.html-> oDir getdata() function call
//during onload, this function is called
app.get('/view_resource_oDir_getdata',(req, res) => {

// Library Imports
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction;

// Connection Initialization
const rpcURL = "HTTP://127.0.0.1:7545";
const web3 = new Web3(rpcURL);

//var account = "0xdC3578B4534c6e169a89c39c0b37a889a6AE6Cea";
//var user_account = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/user_account.json');
//var account= JSON.parse(user_account);

//var contractAddress3 = '0x725844644b9fC50898FDF02DefFF8dBca52405BE';
var contract_address3 = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oDir_contract_address.json');
var contractAddress3= JSON.parse(contract_address3);


//fs.close(file_descriptor);
var ABI = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oDir_getdata_abi.json');
var abi3= JSON.parse(ABI);



var contractInstance3 = new web3.eth.Contract(abi3, contractAddress3);
//console.log(contractInstance3);

//call oDir smart contract function
    contractInstance3.methods.getdata().call().then(function(result) { 
    console.log("List of Objects: ", result[3]);
    
    console.dir(result);

    res.send({resource0_name: result[0][0].toString(), resource0_id: result[0][1].toString(), resource0_type: result[0][2].toString(), resource0_date: result[0][3].toString(), resource0_category: result[0][4].toString(),resource1_name: result[1][0].toString(), resource1_id: result[1][1].toString(), resource1_type: result[1][2].toString(), resource1_date: result[1][3].toString(), resource1_category: result[1][4].toString(), resource2_name: result[2][0].toString(), resource2_id: result[2][1].toString(), resource2_type: result[2][2].toString(), resource2_date: result[2][3].toString(), resource2_category: result[2][4].toString(), resource3_name: result[3][0].toString(), resource3_id: result[3][1].toString(), resource3_type: result[3][2].toString(), resource3_date: result[3][3].toString(), resource3_category: result[3][4].toString()});
  

    //res.send(result[0].toString(), result[1].toString(), result[2].toString(), result[3].toString(), result[4].toString());
  
    //res.send({resource_name: result[0].toString(), resource_id: result[1].toString(), resource_type: result[2].toString(), resource_publishDate: result[3].toString(), resource_category: result[4].toString()});
    //res.send({resource0_name: result[0][0].toString(), resource0_id: result[0][1].toString(), resource0_type: result[0][2].toString(), resource0_date: result[0][3].toString(), resource0_category: result[0][4].toString(),resource1_name: result[1][0].toString(), resource1_id: result[1][1].toString(), resource1_type: result[1][2].toString(), resource1_date: result[1][3].toString(), resource1_category: result[1][4].toString(), resource2_name: result[2]});
  /*
    if( result[2] === undefined || result[3] === undefined){
        console.log("result[2] undefined");
        result_value = 'null';
        res.send({resource0_name: result[0][0].toString(), resource0_id: result[0][1].toString(), resource0_type: result[0][2].toString(), resource0_date: result[0][3].toString(), resource0_category: result[0][4].toString(),resource1_name: result[1][0].toString(), resource1_id: result[1][1].toString(), resource1_type: result[1][2].toString(), resource1_date: result[1][3].toString(), resource1_category: result[1][4].toString(), resource2_name: result_value, resource3_name: result_value});
  
      }else if(result[2] !== undefined && result[3] === undefined){
        console.log("result[3] undefined");
        result_value = 'null';
        res.send({resource0_name: result[0][0].toString(), resource0_id: result[0][1].toString(), resource0_type: result[0][2].toString(), resource0_date: result[0][3].toString(), resource0_category: result[0][4].toString(),resource1_name: result[1][0].toString(), resource1_id: result[1][1].toString(), resource1_type: result[1][2].toString(), resource1_date: result[1][3].toString(), resource1_category: result[1][4].toString(), resource2_name: result[2][0].toString(), resource2_id: result[2][1].toString(), resource2_type: result[2][2].toString(), resource2_date: result[2][3].toString(), resource2_category: result[2][4].toString(), resource3_name: result_value});
      }else{
        console.log("value:");
        res.send({resource0_name: result[0][0].toString(), resource0_id: result[0][1].toString(), resource0_type: result[0][2].toString(), resource0_date: result[0][3].toString(), resource0_category: result[0][4].toString(),resource1_name: result[1][0].toString(), resource1_id: result[1][1].toString(), resource1_type: result[1][2].toString(), resource1_date: result[1][3].toString(), resource1_category: result[1][4].toString(), resource2_name: result[2][0].toString(), resource2_id: result[2][1].toString(), resource2_type: result[2][2].toString(), resource2_date: result[2][3].toString(), resource2_category: result[2][4].toString(), resource3_name: result[3][0].toString(), resource3_id: result[3][1].toString(), resource3_type: result[3][2].toString(), resource3_date: result[3][3].toString(), resource3_category: result[3][4].toString()});
  
      }
      */
      

  });


});
// End view_resource_oDir_getdata

//........................................


//*Imp*//
//browse_resource.html-> Details button -> oDir indexdata() function call
app.post('/view_resource_oDir_getdata_details',(req, res) => {

var index = req.body.index;
console.log(index);

// Library Imports
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction;

// Connection Initialization
const rpcURL = "HTTP://127.0.0.1:7545";
const web3 = new Web3(rpcURL);

//var contractAddress3 = '0x725844644b9fC50898FDF02DefFF8dBca52405BE';
var contract_address3 = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oDir_contract_address.json');
var contractAddress3= JSON.parse(contract_address3);

//fs.close(file_descriptor);
var ABI = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oDir_getdata_abi.json');
var abi3= JSON.parse(ABI);



var contractInstance3 = new web3.eth.Contract(abi3, contractAddress3);
//console.log(contractInstance3);

//call oDir smart contract function
    contractInstance3.methods.indexdata(index).call().then(function(result) { 
    console.log("Resource: ", result[1]);
    
    console.dir(result);

    // Data write in a json -> acc contract account
        writeFile = fs.openSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oDir_getdata_obj_id.json', 'w');
        fs.writeSync(writeFile, JSON.stringify(result[1]));
        console.log('obj_id written to oDir_getdata_obj_id.json file');
        fs.close(writeFile);

    const myURLs = [new URL('http://localhost:4000/single_resource.html')];
    console.log(JSON.stringify(myURLs));
    //res.send(JSON.stringify(myURLs));    
    //res.send(result[1].toString());
    res.send({id: result[1].toString(), page_link: myURLs});
  
    
  });
});
//End Details button -> oDir indexdata() function call


//.......................................


//*Imp*//
//single_resource.html-> oDir getdataInfo() function call
//load during pageload
app.get('/view_single_resource_oDir_getdataInfo',(req, res) => {

// Library Imports
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction;

// Connection Initialization
const rpcURL = "HTTP://127.0.0.1:7545";
const web3 = new Web3(rpcURL);


//var contractAddress3 = '0x725844644b9fC50898FDF02DefFF8dBca52405BE';
var contract_address3 = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oDir_contract_address.json');
var contractAddress3= JSON.parse(contract_address3);


//fs.close(file_descriptor);
var ABI = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oDir_getdata_abi.json');
var abi3= JSON.parse(ABI);



var contractInstance3 = new web3.eth.Contract(abi3, contractAddress3);
//console.log(contractInstance3);

//reading resource id
var resource_id = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oDir_getdata_obj_id.json');
var Rid= JSON.parse(resource_id);


//call oDir smart contract function
    contractInstance3.methods.getdataInfo(Rid).call().then(function(result) { 
    console.log("getdataInfo: ", result);
    
    //console.dir(result);

    //res.send(result[0].toString(), result[1].toString(), result[2].toString(), result[3].toString(), result[4].toString());
  
    res.send({resource0_name: result[0].toString(), resource0_type: result[1].toString(), resource0_date: result[2].toString(), resource0_category: result[3].toString(), resource0_property: result[4].toString(), resource0_desc: result[5].toString(), resource0_owner: result[6].toString(), resource0_id: Rid});
    //res.send({resource0_name: result[0][0].toString(), resource0_id: result[0][1].toString(), resource0_type: result[0][2].toString(), resource0_date: result[0][3].toString(), resource0_category: result[0][4].toString()});
  

  });


}); 
// End view_single_resource_oDir_getdataInfo

//.............................................


//*Imp*//
//single_resource_v1.html-> oACC and oPropRep function call
//load during pageload
app.post('/view_single_resource_ACC',(req, res) => {

// Library Imports
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction;

// Connection Initialization
const rpcURL = "HTTP://127.0.0.1:7545";
const web3 = new Web3(rpcURL);


var contractAddress4 = '0x185458ef9EbC04318721a808Ecc4EC54BB041De9';
//var contract_address4 = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/ACC_contrate_address_resource_single_page.json');
//var contractAddress4= JSON.parse(contract_address4);


//fs.close(file_descriptor);
var ABI = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/ACC_contrate_abi_resource_single_page.json');
var abi4= JSON.parse(ABI);



var contractInstance4 = new web3.eth.Contract(abi4, contractAddress4);
//console.log(contractInstance3);

//reading resource id
var resource_id = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oDir_getdata_obj_id.json');
var Rid= JSON.parse(resource_id);
//var Rid = '0xCBD8F600337F119112584C2A38BDE7166410A84277B40D5BD9DD58AE94B24371';


//call oDir smart contract function
    contractInstance4.methods.getAccInfoMultiple(Rid).call().then(function(result) { 
    console.log("getAccessInfo: ", result);
    
    //console.dir(result);
    
    res.send({resource0_metadata: result[0].toString(), resource0_policy: result[1].toString()});
    
    //res.send({resource0_name: result[0].toString(), resource0_type: result[1].toString(), resource0_date: result[2].toString(), resource0_category: result[3].toString(), resource0_property: result[4].toString(), resource0_desc: result[5].toString(), resource0_owner: result[6].toString(), resource0_id: Rid});
    //res.send({resource0_name: result[0][0].toString(), resource0_id: result[0][1].toString(), resource0_type: result[0][2].toString(), resource0_date: result[0][3].toString(), resource0_category: result[0][4].toString()});

  });


});
//End


//.....................................


//*Imp*//
//single_resource.html-> oACC and oPropRep function call
//show both resource policy, certificate and cpabe metadata
app.post('/view_ACC',(req, res) => {


//reading resource id
var resource_id = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oDir_getdata_obj_id.json');
var Rid= JSON.parse(resource_id);
//var Rid = '12345';



// Library Imports
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction;

// Connection Initialization
const rpcURL = "HTTP://127.0.0.1:7545";
const web3 = new Web3(rpcURL);

//start oProp cntract info
var contractAddress5 = '0x1666127080e1a285AAae0fbBB63C87FD05aa9F7c';
//var contract_address5 = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oProp_contract_address_resource_single_page.json');
//var contractAddress5= JSON.parse(contract_address5);

//ABI for oProp
var ABI5 = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oProp_contract_abi_resource_single_page.json');
var abi5= JSON.parse(ABI5);

var contractInstance5 = new web3.eth.Contract(abi5, contractAddress5);
//console.log(contractInstance5);
//..end oProp contract info


//call oProp smart contract function
    contractInstance5.methods.getPropertyInfo(Rid).call().then(function(output) { 
    console.log("getPropertyInfo: ", output);
    //console.dir(output);

    // Data write in a json -> acc contract account
        writeFile = fs.openSync('resource_certificate.crt', 'w');
        fs.writeSync(writeFile, JSON.stringify(output[1].toString()));
        console.log('obj_certificate written in resource_certificate.crt file');
        fs.close(writeFile);

    
    //res.send({resource0_metadata: result[0].toString(), resource0_policy: result[1].toString(), resource0_prop: output[0].toString(), resource0_cert: output[1].toString()});
  });



// ACC contract address
var contractAddress4 = '0x185458ef9EbC04318721a808Ecc4EC54BB041De9';
//var contract_address4 = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/ACC_contrate_address_resource_single_page.json');
//var contractAddress4= JSON.parse(contract_address4);


//ABI for ACC;
var ABI4 = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/ACC_contrate_abi_resource_single_page.json');
var abi4= JSON.parse(ABI4);



var contractInstance4 = new web3.eth.Contract(abi4, contractAddress4);
//console.log(contractInstance3);

//reading resource id
var resource_id = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oDir_getdata_obj_id.json');
var Rid= JSON.parse(resource_id);
//var Rid = '0xCBD8F600337F119112584C2A38BDE7166410A84277B40D5BD9DD58AE94B24371';


//call oDir smart contract function
    contractInstance4.methods.getAccInfoMultiple(Rid).call().then(function(result) { 
    console.log("getAccessInfo: ", result);
    
    //console.dir(result);

var age = result[1].toString();
var preference = result[3].toString();
var club_member= result[5].toString();

var condition1 = result[2].toString();
var condition2 = result[4].toString();

var policy_parameter1 = "User's age should be" + " " +age;
var policy_parameter2 = "User may be a " + " " + preference + " " +"client";
var policy_parameter3 = "User is a member of " + " " + club_member;

if( preference === "null" || preference === "N/A" || preference === "n/a" || preference === "0" ){
    
    var policy_parameter2 = " ";
    var condition1 = " ";
    var policy_parameter3 = " ";
    var condition2 = " ";

}

if( club_member === "null" || club_member === "N/A" || club_member === "n/a" ||club_member === "0" ){
    
    var policy_parameter3 = " ";
    var condition2 = " ";

}
 
 //reading resource id
//var resource_id = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/oDir_getdata_obj_id.json');
//var Rid= JSON.parse(resource_id);
 //val = 0;
   //Rid = 12345;

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
  //const pyProg = spawn('python', ['/home/rimjhim/front_end/JWT_token/token_simplify/certificate_read_all.py']);
    
  pyProg.stdout.on('data', function(data) {
        
        console.log(data.toString());
        res.send({resource0_policy1: policy_parameter1, resource0_policy2: condition1, resource0_policy3: policy_parameter2, resource0_policy4: condition2 , resource0_policy5: policy_parameter3, resource0_cert: data.toString()});
        //res.send({resource0_cert: data.toString()});
        
    });



  }).catch((e) => {
            console.log('error')
            res.send(JSON.stringify('error'));
            });

});
//End

//.............................


//*Imp*//
//User Input for edit personal information (edit persinal infomation page)
//Start of edit personal information
app.post('/edit_personal_information',(req, res) => {
  
var name = req.body.name;
console.log(name);

var email = req.body.email;
console.log(email);

var address = req.body.address;
console.log(address);

var contact_info = req.body.contact_info;
console.log(contact_info);

//read user_name
var user_name = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/username.txt', 'utf8');
    console.log(user_name.toString());

var sql = 'UPDATE test SET name = ? , email = ? , address = ? , contact_info = ? WHERE u_name = ?';

//var sql = 'SELECT u_name,password FROM test where u_name = ?';
connection.query(sql, [name, email, address,contact_info, user_name], function (err, data) {
  if (err) throw err;
  console.log(data);
  console.log(data.affectedRows + " record(s) updated");
  
  if(data.affectedRows === 1){
    res.send('1');
  }

  if(data.affectedRows !== 1){
    res.send('0');
  }

  

});

}); // end of app.post function
// end of edit personal information

//...........................................

//*Imp*//
//User Input for edit password (edit password page)
//Start of edit password
app.post('/edit_password',(req, res) => {
  
var current_pass = req.body.current_pass;
console.log(current_pass);

var new_pass = req.body.new_pass;
console.log(new_pass);

var confirm_pass = req.body.confirm_pass;
console.log(confirm_pass);


//read user_name
var user_name = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/username.txt', 'utf8');
    console.log(user_name.toString());

var sql = 'SELECT u_name, password FROM test where u_name = ?';
connection.query(sql, [user_name], function (err, rows) {
  if (err) throw err;
  //console.log(rows);

  rows.forEach(function(result) {
            console.log(result.u_name,result.password);

            if(current_pass !== result.password ){

                res.send('3');
                //res.send('Incorrect Password');
            }

            if(current_pass === result.password ){

            if(new_pass === confirm_pass){

var sql = 'UPDATE test SET password = ?  WHERE u_name = ?';
connection.query(sql, [new_pass, result.u_name], function (err, data) {
  if (err) throw err;
  console.log(data);
  console.log(data.affectedRows + " record(s) updated");
  
  
  if(data.affectedRows === 1){
    res.send('1');
  }

  if(data.affectedRows !== 1){
    res.send('0');
  }
  

});
            }

            if(new_pass !== confirm_pass){

                res.send('2');
                //res.send('New Password and Confirmed Password Does Not match');
            }

            }

        });

});


}); // end of app.post function
// end of edit password


//........................................

//*Imp*//
//add_resource_v2.html-> read/show and deploy SM in add_resource_v2.html
app.get('/load_data_with_SC_deploy',token_authentication,(req, res) => {

//Read Username
var user_name = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/username.txt', 'utf8');
console.log(user_name.toString());

//BC connection start
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction;

// Connection Initialization
const rpcURL = "HTTP://127.0.0.1:7545";
const web3 = new Web3(rpcURL);
//BC connection close

//User account define
//var account = "0xdC3578B4534c6e169a89c39c0b37a889a6AE6Cea";
var user_account = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/user_account.json');
var account= JSON.parse(user_account);


//SC oProp Parameters start
//var byte_code = "608060405234801561001057600080fd5b50606460008190555060ca806100276000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c806380219655146037578063ed0109a5146062575b600080fd5b606060048036036020811015604b57600080fd5b8101908080359060200190929190505050607e565b005b6068608c565b6040518082815260200191505060405180910390f35b806000540160008190555050565b6000805490509056fea265627a7a7230582002f975dfd70c1b1f649671805826a83fc9b92457fe7dd245527f56b7776d043464736f6c634300050a0032";
var byte_code = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oprop_byte_code.json');
var bytecode= JSON.parse(byte_code);


//ABI for oProp
//var ABI = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/oProp_contract_abi_resource_single_page.json');
var ABI = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oprop_contract_setPropertyInfo_abi.json');
var parsed = JSON.parse(ABI);

//SC oProp parameters end

//.........................

//SC ACC parameter start
//var byte_code = "608060405234801561001057600080fd5b50606460008190555060ca806100276000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c806380219655146037578063ed0109a5146062575b600080fd5b606060048036036020811015604b57600080fd5b8101908080359060200190929190505050607e565b005b6068608c565b6040518082815260200191505060405180910390f35b806000540160008190555050565b6000805490509056fea265627a7a7230582002f975dfd70c1b1f649671805826a83fc9b92457fe7dd245527f56b7776d043464736f6c634300050a0032";
var byte_code1 = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/acc_byte_code.json');
var bytecode1= JSON.parse(byte_code1);

//var ABI1 = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/ACC_contrate_abi_resource_single_page.json');
var ABI1 = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/acc_contract_setAccessInfo_abi.json');
var parsed1= JSON.parse(ABI1);

//SC ACC parameter end

//.........................

//DB query
//select based on u_name
var sql = "SELECT * FROM test where u_name = ? ";
connection.query(sql, [user_name], function (err, rows) {
  if (err) throw err;
  var auth = "true";
  console.log('Data received from test:');

  rows.forEach(function(result) {
            console.log(result.u_name, result.name, result.email, result.address, result.contact_info, result.device_id, result.service_provider);
            //res.send({username: result.u_name, name: result.name, email:result.email, address:result.address, contact_info:result.contact_info, device_id:result.device_id, service_provider:result.service_provider, token: auth});
  
//Deploy oProp SC deploy code start
const contract = new web3.eth.Contract(parsed);
    contract.deploy({
      data: bytecode,
    })
    .send({
      from: account,    gas: 9000000
        
    }).then(function(newContractInstance){
        console.log(newContractInstance.options.address) // instance with the new contract address
        
        
        // Data write in a json -> oProp contract account
        writeFile = fs.openSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oProp_contract_account.json', 'w');
        fs.writeSync(writeFile, JSON.stringify(newContractInstance.options.address));
        console.log('account written to oProp_contract_account.json file');
        fs.close(writeFile);


        // Deploy ACC SC code start

        const contract1 = new web3.eth.Contract(parsed1);
    contract1.deploy({
      data: bytecode1,
    })
    .send({
      from: account,    gas: 9000000
        
    }).then(function(newContractInstance1){
        console.log(newContractInstance1.options.address); // instance with the new contract address
        //res.send(JSON.stringify(newContractInstance.options.address));
        
        res.send({name: result.name, oProp_contract_address: newContractInstance.options.address, ACC_contract_address: newContractInstance1.options.address});

        
        // Data write in a json -> acc contract account
        writeFile = fs.openSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/acc_contract_account.json', 'w');
        fs.writeSync(writeFile, JSON.stringify(newContractInstance1.options.address));
        console.log('account written to acc_contract_account.json file');
        fs.close(writeFile);

    }); // Deploy ACC AC code end

         }); //End of oProp deploy

})//End of rows.foreach

}); // End of query


}); //End load_data_with_SC_deploy

//............................................

//*Imp*//
// add_resource_v2.html -> reading certificate
app.post('/add_resource_with_oDir',(req, res)=>{



var info = req.body.info;
//console.log(info);

var cert = req.body.cert;
//console.log(cert);

var desc = req.body.desc;
//console.log(desc);

var policy = req.body.policy;
//console.log(policy);

var metadata = req.body.metadata;
//console.log(metadata);

//reading info from files
var desc1 = fs.readFileSync('/home/rimjhim/mysqlexperiment/cert_for_object/properties.txt').toString();
var cert1 = fs.readFileSync('/home/rimjhim/mysqlexperiment/cert_for_object/certificate.crt').toString();
var metadata1 = fs.readFileSync('/home/rimjhim/mysqlexperiment/cert_for_object/metadata/O_metadata.txt.cpabe').toString();




// Library Imports
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction;

// Connection Initialization
const rpcURL = "HTTP://127.0.0.1:7545";
const web3 = new Web3(rpcURL);

var user_account = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/user_account.json');
var user_acc= JSON.parse(user_account);


//oPRop parameters
//var oProp_contract_address = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oProp_contract_account.json');
//var oProp_contractAddress= JSON.parse(oProp_contract_address);
var oProp_contractAddress = '0x24630345D865B26f54AFaD999d6740EF18FeB6E0';

//var ABI1 = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oProp_contract_abi_resource_single_page.json');
var ABI = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oprop_contract_setPropertyInfo_abi.json');
var abi= JSON.parse(ABI);
//oPRop parameters end

//.................

//ACC parameter Start
//var ACC_contract_address = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/acc_contract_account.json');
//var ACC_contractAddress= JSON.parse(ACC_contract_address);
var ACC_contractAddress = '0xAc76858F3d74FBf46dACe32A098E4778A77351b9';

var ABI1 = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/acc_contract_setAccessInfo_abi.json');
var abi1= JSON.parse(ABI1);

//ACC parameter End

//Function call oProp
var contractInstance = new web3.eth.Contract(abi, oProp_contractAddress);
//console.log(contractInstance1);
const gas_ammount = 3000000;


   
    info1 = "12345";
    info2 = "desc1 + desc";
    info3 = "cert1";

    //function call
    contractInstance.methods.setPropertyInfo(info1,info2,info3).send({from: user_acc, gas: gas_ammount})
    .on('transactionHash', function(hash){
        console.log(hash);
        if( 0 !== hash.length){
        //alert("Successfully Added!!" + "\n" +"Transaction Hash:" + "\n" + hash);
        //alert("Successful Submission!!");
        //res.send("yes");
        console.log("Successful Submission oProp!!");

              //Function call ACC

var contractInstance2 = new web3.eth.Contract(abi1, ACC_contractAddress);
//console.log(contractInstance1);

  //user_acc= "0x6d143AbE33d94B5F2521b0309Bc7Aa28eC022C42";
  //console.log(acc);

    //const gas_ammount = 5000000;

    info1 = "12345";
    info2 = "policy";
    info3 = "metadata1";

    //function call
    contractInstance2.methods.addAccessInfo(info1,info2,info3).send({from: user_acc, gas: gas_ammount})
    .on('transactionHash', function(hash){
        console.log(hash);
        if( 0 !== hash.length){
        //alert("Successfully Added!!" + "\n" +"Transaction Hash:" + "\n" + hash);
        //alert("Successful Submission!!");
        //res.send("yes");
        console.log("Successful Submission ACC!!");

      res.send("yes");

      }

      if( 0 == hash.length){
        //alert("Error!! Please Try Again");
        console.log("Error!! Please Try Again");
        res.send("no1");
      }

}); // End ACC function Call

      }

      if( 0 == hash.length){
        //alert("Error!! Please Try Again");
        console.log("Error!! Please Try Again");
        res.send("no2");
      }

}); // End oProp SC function call

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


var json_String = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/properties.json');
var jsonString= JSON.parse(json_String);
console.log(jsonString);
console.log(jsonString.OName);
//

//contract account
var contractAddress3 = '0x69CD66985EF7bbC8E0CB50cd1D5468736E594cE2';
//var contract_address3 = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oDir_contract_address.json');
//var contractAddress3= JSON.parse(contract_address3);


var ABI = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/BC_files/oDir_getdata_abi.json');
var abi3= JSON.parse(ABI);

var contractInstance3 = new web3.eth.Contract(abi3, contractAddress3);

    info1 = jsonString.Oid;
    info2 = jsonString.OName;
    info3 = jsonString.OPublishDate;
    info4 = jsonString.O_Owner;
    info5 = jsonString.ODesc;
    info6 = jsonString.Otype;
    info7 = jsonString.OPrimaryDesc;
    info8 = jsonString.OCategory;

    //function call
    contractInstance3.methods.registerdata(info1,info2,info3,info4,info5,info6,info7,info8).send({from: user_acc, gas: gas_ammount})
    .on('transactionHash', function(hash){
        console.log(hash);
        if( 0 !== hash.length){
        //alert("Successfully Added!!" + "\n" +"Transaction Hash:" + "\n" + hash);
        //alert("Successful Submission!!");
        //res.send("yes");
        console.log("Successful Submission ACC!!");
      }

      if( 0 == hash.length){
        console.log("Error!! Please Try Again");
      }

}); // End oDir function Call


});
//End add_resource


//.............................................




//App running on port 4000

app.listen(4000, function(){
  console.log('listening on port 4000');
});
