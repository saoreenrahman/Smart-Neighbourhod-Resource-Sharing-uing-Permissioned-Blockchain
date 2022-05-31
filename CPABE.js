const { exec } = require("child_process");
const fs = require('fs');

function shell_script() {
exec("cd cpabe; mkdir shell_script", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    //console.log(`stdout: ${stdout}`);
});

}

function cpabe_encryption() {

    var file = 'confedential_resource_information.txt';

    //read resource name from resoure/resource_name.txt file
    var policy_read = fs.readFileSync('/home/rimjhim/front_end/JWT_token/token_simplify/cpabe_ro/resource/resource_policy.txt', 'utf8');
    //var policy = '( ( age > 10 and 1 of ( preference = 1, preference = 0 ) ) or ( club_member = 1 ) )';
    //var policy = `${policy_read}`;

exec(`cd cpabe_ro; cpabe-enc pub_key ${file} ${policy_read}`, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    //console.log(`stdout: ${stdout}`);
});

}


function cpabe_decryption() {

var file = 'confedential_resource_information.txt.cpabe';
exec(`cd cpabe_ro; cpabe-dec pub_key B_priv_key confedential_resource_information.txt.cpabe`, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});

}



module.exports = { shell_script, cpabe_encryption, cpabe_decryption};
