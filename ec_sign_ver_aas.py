from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives.serialization import load_pem_public_key
#from cryptography.hazmat.primitives import serialization as crypto_serialization
from pathlib import Path

from ecdsa.ecdsa import curve_secp256k1
from ecdsa.curves import SECP256k1

from Crypto.PublicKey import ECC
from Crypto.Hash import SHA256
from Crypto.Signature import DSS
from pathlib import Path

import sys
import os
import hashlib
import functools
import ecdsa
from pathlib import Path

from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import ec

# data
#data = b"this is some data to sign"


#reading message
f = open("/home/rimjhim/front_end/JWT_token/token_simplify/EC/EC_Server/message_ec_sign_gen.txt", "r")
message = f.read()
message_as_bytes = str.encode(message)
#print("message", message)
f.close()

signature_algorithm = ec.ECDSA(hashes.SHA256())


with open('/home/rimjhim/front_end/JWT_token/token_simplify/EC/EC_Server/ec_p_key.txt', 'rb') as f:
    p_k_b = f.read()
    f.close()

p_pub_key = load_pem_public_key(p_k_b, default_backend())



with open("/home/rimjhim/front_end/JWT_token/token_simplify/EC/EC_Server/ec_sig_gen.pem", "rb") as f1:
    sig = f1.read()
    #print(sig)
    #print('\n')


# Verify
try:
    p_pub_key.verify(sig, message_as_bytes, signature_algorithm)
    print('Verification OK')
except InvalidSignature:
    print('Verification failed')