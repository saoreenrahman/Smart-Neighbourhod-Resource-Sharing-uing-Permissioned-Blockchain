const fs = require('fs');

// Ring Signature Verification
function ring_sig_verify() {

const { spawn } = require('child_process');
const pyProg = spawn('python', ['/home/rimjhim/front_end/JWT_token/token_simplify/Ring/Ring_Server/auth_sig_ver_aas.py']);
//const pyProg = spawn('python', ['/home/rimjhim/front_end/JWT_token/token_simplify/UI_Ring/auth_sig_ver.py']);


pyProg.stdout.on('data', function (data) {
    //console.log('Pipe data from python script ...');
    dataToSend = data.toString();
    console.log(data.toString());

    fs.writeFile('/home/rimjhim/front_end/JWT_token/token_simplify/Ring/Ring_Server/verification.txt', data.toString(), (err) => {
              if (err) throw err;
              
    }); 

    });

// in close event we are sure that stream from child process is closed
    pyProg.on('close', (code) => {
    //console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    //console.log(dataToSend);
    });


}//end


// Ring Signature Verification
function ring_sig_verify_rid() {

const { spawn } = require('child_process');
const pyProg = spawn('python', ['/home/rimjhim/front_end/JWT_token/token_simplify/Ring/Ring_Server/auth_sig_ver_aas_rid.py']);
//const pyProg = spawn('python', ['/home/rimjhim/front_end/JWT_token/token_simplify/UI_Ring/auth_sig_ver.py']);


pyProg.stdout.on('data', function (data) {
    //console.log('Pipe data from python script ...');
    dataToSend = data.toString();
    console.log(data.toString());

    fs.writeFile('/home/rimjhim/front_end/JWT_token/token_simplify/Ring/Ring_Server/verification.txt', data.toString(), (err) => {
              if (err) throw err;
              
    }); 

    });

// in close event we are sure that stream from child process is closed
    pyProg.on('close', (code) => {
    //console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    //console.log(dataToSend);
    });


}//end





//EC Signature Verification
function ec_sig_verify() {
console.log("executing ec_sig_verify");

//fs.truncate('/home/rimjhim/front_end/JWT_token/token_simplify/EC/EC_Server/verification.txt', 0, function(){console.log('done')})

//fs.writeFile('/home/rimjhim/front_end/JWT_token/token_simplify/Ring/verification.txt', '', function(){console.log('done')})


const { spawn } = require('child_process');
const pyProg = spawn('python', ['/home/rimjhim/front_end/JWT_token/token_simplify/EC/EC_Server/ec_sign_ver_aas.py']);

pyProg.stdout.on('data', function (data) {
    //console.log('Pipe data from python script ...');
    dataToSend = data.toString();
    console.log(data.toString());

    fs.writeFile('/home/rimjhim/front_end/JWT_token/token_simplify/EC/EC_Server/verification.txt', data.toString(), (err) => {
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




module.exports = { ring_sig_verify, ec_sig_verify, ring_sig_verify_rid };