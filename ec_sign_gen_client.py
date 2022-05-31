from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives.serialization import load_pem_public_key
from cryptography.hazmat.primitives.serialization import load_pem_private_key
#from cryptography.hazmat.primitives import serialization as crypto_serialization
from pathlib import Path

#from ecdsa.ecdsa import curve_secp256k1
from ecdsa.curves import SECP256k1

#from Crypto.PublicKey import ECC
#from Crypto.Hash import SHA256
#from Crypto.Signature import DSS
#from pathlib import Path

import sys
import os
import hashlib
import functools
import ecdsa
#from pathlib import Path

from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import ec


#hash
signature_algorithm = ec.ECDSA(hashes.SHA256())

with open('/home/rimjhim/front_end/JWT_token/token_simplify/EC/EC_Client/ec_s_key.txt', 'rb') as f:
    s_k_b = f.read()
    f.close()

crypto_backend = default_backend()
key = load_pem_private_key(s_k_b, password=None, backend=crypto_backend)

# data
#data = b"this is some data to sign"

#message read 
#a = int(sys.argv[1])
#print(a)
a = 1

#writing message of ACC contract
if (a == 1):
    f = open("/home/rimjhim/front_end/JWT_token/token_simplify/EC/EC_Server/message_ec_sign_gen.txt", "w")
    m_0=Path('/home/rimjhim/front_end/JWT_token/token_simplify/UI_Ring/last_nonce_client.txt').read_text()
    m0 = m_0 
    m_1=Path('/home/rimjhim/front_end/JWT_token/token_simplify/UI_Ring/acc_sig_gen/acc_account.txt').read_text()
    m1 = m_1 
    m_2=Path('/home/rimjhim/front_end/JWT_token/token_simplify/UI_Ring/acc_sig_gen/acc_bytecode.txt').read_text()
    m2 = m_2 
    m_3=Path('/home/rimjhim/front_end/JWT_token/token_simplify/UI_Ring/acc_sig_gen/acc_abi.txt').read_text()
    m3 = m_3    
    message = m0 + ' , ' + m1 + ' , ' + m2 + ' , ' + m3
    message_as_bytes_acc = str.encode(message)
    #print("message", message)
    f.write(message)
    f.close()
    #print('\n')

#writing message of oProp contrct 
if (a == 0):
    f = open("/home/rimjhim/front_end/JWT_token/token_simplify/EC/EC_Server/message_ec_sign_gen.txt", "w")
    m_0=Path('/home/rimjhim/RingSig/UI_Ring_Sig/UI_Ring/last_nonce_client.txt').read_text()
    m0 = m_0 
    m_1=Path('/home/rimjhim/front_end/JWT_token/token_simplify/UI_Ring/acc_sig_gen/oProp_account.txt').read_text()
    m1 = m_1 
    m_2=Path('/home/rimjhim/front_end/JWT_token/token_simplify/UI_Ring/acc_sig_gen/oProp_bytecode.txt').read_text()
    m2 = m_2 
    m_3=Path('/home/rimjhim/front_end/JWT_token/token_simplify/UI_Ring/acc_sig_gen/oProp_abi.txt').read_text()
    m3 = m_3    
    message = m0 + ' , ' + m1 + ' , ' + m2 + ' , ' + m3
    message_as_bytes_oProp = str.encode(message)
    #print("message", message)
    f.write(message)
    f.close()
    #print('\n')


if (a == 1):
    signature = key.sign(message_as_bytes_acc, signature_algorithm)
    print('acc signature',signature)
if (a == 0):
    signature = key.sign(message_as_bytes_oProp, signature_algorithm)
    print('oProp signature',signature)

#signature = key.sign(message_as_bytes, signature_algorithm)
#print('Signature: 0x%s' % signature.hex())

if len(signature) == 0:
    print('0')
else:
    print('1')

f = open("/home/rimjhim/front_end/JWT_token/token_simplify/EC/EC_Server/ec_sig_gen.pem", "wb")
f.write(signature)
f.close()





sys.stdout.flush()

#Verify
#with open('ec_p_key.txt', 'rb') as f:
#    p_k_b = f.read()
#    f.close()

#p_key = load_pem_public_key(p_k_b, default_backend())
#try:
#    p_key.verify(signature, message_as_bytes, signature_algorithm)
#    print('Verification OK')
#except InvalidSignature:
#    print('Verification failed')