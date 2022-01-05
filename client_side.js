const fs = require('fs');

// Ring Signature Generation
function ring_sig_gen_for_view_resource(index) {

//console.log(index);

fs.writeFile('/home/rimjhim/front_end/JWT_token/token_simplify/Ring/Ring_Client/resource_index.txt', index, function (err) {
  if (err) return console.log(err);
  console.log('written in the resource_index.txt file - > index');
})


const { spawn } = require('child_process');
const pyProg = spawn('python', ['/home/rimjhim/front_end/JWT_token/token_simplify/Ring/Ring_Client/ring_sig_client.py']);

pyProg.stdout.on('data', function (data) {
    //console.log('Pipe data from python script ...');
    dataToSend = data.toString();
    console.log(data.toString());
    fs.writeFile('/home/rimjhim/front_end/JWT_token/token_simplify/Ring/Ring_Client/signature.txt', data.toString(), (err) => {
              if (err) throw err;
              
    }); 

    });

// in close event we are sure that stream from child process is closed
    pyProg.on('close', (code) => {
    //console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    //console.log(dataToSend);
    });


}


// Ring Signature Generation
function ring_sig_gen_for_view_specific_resource(Rid) {

console.log(Rid);

fs.writeFile('/home/rimjhim/front_end/JWT_token/token_simplify/Ring/Ring_Client/resource_id.txt', Rid, function (err) {
  if (err) return console.log(err);
  console.log('written in the resource_id.txt file - > index');
})


const { spawn } = require('child_process');
const pyProg = spawn('python', ['/home/rimjhim/front_end/JWT_token/token_simplify/Ring/Ring_Client/ring_sig_client_rid.py']);

pyProg.stdout.on('data', function (data) {
    //console.log('Pipe data from python script ...');
    dataToSend = data.toString();
    console.log(data.toString());
    fs.writeFile('/home/rimjhim/front_end/JWT_token/token_simplify/Ring/Ring_Client/signature.txt', data.toString(), (err) => {
              if (err) throw err;
              
    }); 

    });

// in close event we are sure that stream from child process is closed
    pyProg.on('close', (code) => {
    //console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    //console.log(dataToSend);
    });


}




// EC Signature Generation
function ec_sig_gen_for_add_resource(info, cert, desc, policy, metadata) {

//console.log(info, cert, desc, policy, metadata);

/*
fs.writeFile('user_input_resource_id.txt', index, function (err) {
  if (err) return console.log(err);
  console.log('written in the user_input_resource_id.txt file - > index');
})*/


const { spawn } = require('child_process');
const pyProg = spawn('python', ['/home/rimjhim/front_end/JWT_token/token_simplify/EC/EC_Client/ec_sign_gen_client.py']);

pyProg.stdout.on('data', function (data) {
    //console.log('Pipe data from python script ...');
    dataToSend = data.toString();
    console.log(data.toString());
    });

// in close event we are sure that stream from child process is closed
    pyProg.on('close', (code) => {
    //console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    //console.log(dataToSend);
    });

}

module.exports = { ring_sig_gen_for_view_resource, ec_sig_gen_for_add_resource, ring_sig_gen_for_view_specific_resource };