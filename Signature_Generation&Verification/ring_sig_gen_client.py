#! /usr/bin/env python
#
# Provide an implementation of Linkable Spontaneus Anonymous Group Signature
# over elliptic curve cryptography.
#
# Implementation of cryptographic scheme from: https://eprint.iacr.org/2004/027.pdf
#
#
# Written in 2017 by Fernanddo Lobato Meeser and placed in the public domain.


import sys
import os
import hashlib
import functools
import ecdsa
from pathlib import Path
import random
import numpy as np
from random import randint
import array

from ecdsa.util import randrange
from ecdsa.ecdsa import curve_secp256k1
from ecdsa.curves import SECP256k1
from ecdsa import numbertheory

def ring_signature(siging_key, M, y, G=SECP256k1.generator, hash_func=hashlib.sha3_256):
    """
        Generates a ring signature for a message given a specific set of
        public keys and a signing key belonging to one of the public keys
        in the set.

        PARAMS
        ------

            signing_key: (int) The with which the message is to be anonymously signed.

            key_idx: (int) The index of the public key corresponding to the signature
                private key over the list of public keys that compromise the signature.

            M: (str) Message to be signed.

            y: (list) The list of public keys which over which the anonymous signature
                will be compose.

            G: (ecdsa.ellipticcurve.Point) Base point for the elliptic curve.

            hash_func: (function) Cryptographic hash function that recieves an input
                and outputs a digest.

        RETURNS
        -------

            Signature (c_0, s, Y) :
                c_0: Initial value to reconstruct signature.
                s = vector of randomly generated values with encrypted secret to
                    reconstruct signature.
                Y = Link for current signer.

    """
    n = len(y)
    c = [0] * n
    s = [0] * n
    key_idx = 0

    # STEP 1
    H = H2(y, hash_func=hash_func)
    #Y =  H * siging_key
    Y = linkability(y)

    # STEP 2
    u = randrange(SECP256k1.order)
    c[(key_idx + 1) % n] = H1([y, Y, M, G * u, H * u], hash_func=hash_func)

    # STEP 3
    for i in [ i for i in range(key_idx + 1, n) ] + [i for i in range(key_idx)]:

        s[i] = randrange(SECP256k1.order)

        z_1 = (G * s[i]) + (y[i] * c[i])
        z_2 = (H * s[i]) + (Y * c[i])

        c[(i + 1) % n] = H1([y, Y, M, z_1, z_2], hash_func=hash_func)

    # STEP 4
    s[key_idx] = (u - siging_key * c[key_idx]) % SECP256k1.order
    

    return (c[0], s, Y)


def verify_ring_signature(message, y, c_0, s, Y, G=SECP256k1.generator, hash_func=hashlib.sha3_256):
    """
        Verifies if a valid signature was made by a key inside a set of keys.


        PARAMS
        ------
            message: (str) message whos' signature is being verified.

            y: (list) set of public keys with which the message was signed.

            Signature:
                c_0: (int) initial value to reconstruct the ring.

                s: (list) vector of secrets used to create ring.

                Y = (int) Link of unique signer.

            G: (ecdsa.ellipticcurve.Point) Base point for the elliptic curve.

            hash_func: (function) Cryptographic hash function that recieves an input
                and outputs a digest.

        RETURNS
        -------
            Boolean value indicating if signature is valid.

    """
    H = H2(y, hash_func=hash_func)
    #Y = linkability(y)

    i = 0
    n = 3
    c = [c_0] + [0] * (n - 1)

    H = H2(y, hash_func=hash_func)

    for i in range(n):
        z_1 = (G * s[i]) + (y[i] * c[i])
        z_2 = (H * s[i]) + (Y * c[i])

        if i < n - 1:
            c[i + 1] = H1([y, Y, message, z_1, z_2], hash_func=hash_func)
        else:
            return c_0 == H1([y, Y, message, z_1, z_2], hash_func=hash_func)

    return False


def map_to_curve(x, P=curve_secp256k1.p()):
    """
        Maps an integer to an elliptic curve.

        Using the try and increment algorithm, not quite
        as efficient as I would like, but c'est la vie.

        PARAMS
        ------
            x: (int) number to be mapped into E.

            P: (ecdsa.curves.curve_secp256k1.p) Modulo for elliptic curve.

        RETURNS
        -------
            (ecdsa.ellipticcurve.Point) Point in Curve
    """
    x -= 1
    y = 0
    found = False

    while not found:
        x += 1
        f_x = (x * x * x + 7) % P

        try:
            y = numbertheory.square_root_mod_prime(f_x, P)
            found = True
        except Exception as e:
            pass

    return ecdsa.ellipticcurve.Point(curve_secp256k1, x, y)


def H1(msg, hash_func=hashlib.sha3_256):
    """
        Return an integer representation of the hash of a message. The
        message can be a list of messages that are concatenated with the
        concat() function.

        PARAMS
        ------
            msg: (str or list) message(s) to be hashed.

            hash_func: (function) a hash function which can recieve an input
                string and return a hexadecimal digest.

        RETURNS
        -------
            Integer representation of hexadecimal digest from hash function.
    """
    return int('0x'+ hash_func(concat(msg)).hexdigest(), 16)


def H2(msg, hash_func=hashlib.sha3_256):
    """
        Hashes a message into an elliptic curve point.

        PARAMS
        ------
            msg: (str or list) message(s) to be hashed.

            hash_func: (function) Cryptographic hash function that recieves an input
                and outputs a digest.
        RETURNS
        -------
            ecdsa.ellipticcurve.Point to curve.
    """
    return map_to_curve(H1(msg, hash_func=hash_func))


def concat(params):
    """
        Concatenates a list of parameters into a bytes. If one
        of the parameters is a list, calls itself recursively.

        PARAMS
        ------
            params: (list) list of elements, must be of type:
                - int
                - list
                - str
                - ecdsa.ellipticcurve.Point

        RETURNS
        -------
            concatenated bytes of all values.
    """
    n = len(params)
    bytes_value = [0] * n

    for i in range(n):

        if type(params[i]) is int:
            bytes_value[i] = params[i].to_bytes(32, 'big')
        if type(params[i]) is list:
            bytes_value[i] = concat(params[i])
        if type(params[i]) is ecdsa.ellipticcurve.Point:
            bytes_value[i] = params[i].x().to_bytes(32, 'big') + params[i].y().to_bytes(32, 'big')
        if type(params[i]) is str:
            bytes_value[i] = params[i].encode()

        if bytes_value[i] == 0:
            bytes_value[i] = params[i].x().to_bytes(32, 'big') + params[i].y().to_bytes(32, 'big')

    return functools.reduce(lambda x, y: x + y, bytes_value)


def stringify_point(p):
    """
        Represents an elliptic curve point as a string coordinate.

        PARAMS
        ------
            p: ecdsa.ellipticcurve.Point - Point to represent as string.

        RETURNS
        -------
            (str) Representation of a point (x, y)
    """
    return '{},{}'.format(p.x(), p.y())


def stringify_point_js(p):
    """
        Represents an elliptic curve point as a string coordinate, the
        string format is javascript so other javascript scripts can
        consume this.

        PARAMS
        ------
            p: ecdsa.ellipticcurve.Point - Point to represent as string.

        RETURNS
        -------
            (str) Javascript string representation of a point (x, y)
    """
    return 'new BigNumber("{}"), new BigNumber("{}")'.format(p.x(), p.y())


def export_signature(y, message, signature, foler_name='./data', file_name='signature.txt'):
    """ Exports a signature to a specific folder and filename provided.

        The file contains the signature, the ring used to generate signature
        and the message being signed.
    """
    if not os.path.exists(foler_name):
        os.makedirs(foler_name)

    arch = open(os.path.join(foler_name, file_name), 'w')
    S = ''.join(map(lambda x: str(x) + ',', signature[1]))[:-1]
    Y = stringify_point(signature[2])

    dump = '{}\n'.format(signature[0])
    dump += '{}\n'.format(S)
    dump += '{}\n'.format(Y)

    arch.write(dump)

    pub_keys = ''.join(map(lambda yi: stringify_point(yi) + ';', y))[:-1]
    data = '{}\n'.format(''.join([ '{},'.format(m) for m in message])[:-1])
    data += '{}\n,'.format(pub_keys)[:-1]

    arch.write(data)
    arch.close()


def export_private_keys(s_keys, foler_name='./data', file_name='secrets.txt'):
    """ Exports a set  of private keys to a file.

        Each line in the file is one key.
    """
    if not os.path.exists(foler_name):
        os.makedirs(foler_name)

    arch = open(os.path.join(foler_name, file_name), 'w')

    for key in s_keys:
        arch.write('{}\n'.format(key))

    arch.close()


def export_signature_javascript(y, message, signature, foler_name='./data', file_name='signature.js'):
    """ Exports a signatrue in javascript format to a file and folder.
    """
    if not os.path.exists(foler_name):
        os.makedirs(foler_name)

    arch = open(os.path.join(foler_name, file_name), 'w')

    S = ''.join(map(lambda x: 'new BigNumber("' + str(x) + '"),', signature[1]))[:-1]
    Y = stringify_point_js(signature[2])

    dump = 'var c_0 = new BigNumber("{}");\n'.format(signature[0])
    dump += 'var s = [{}];\n'.format(S)
    dump += 'var Y = [{}];\n'.format(Y)

    arch.write(dump)

    pub_keys = ''.join(map(lambda yi: stringify_point_js(yi) + ',', y))[:-1]

    data = 'var message = [{}];\n'.format(''.join([ 'new BigNumber("{}"),'.format(m) for m in message])[:-1])
    data += 'var pub_keys = [{}];'.format(pub_keys)

    arch.write(data + '\n')
    arch.close()

def keyGen():
    # key Generation
    x1 = 32076546148956423627106248222626084294972657934863549023221256992304541353107
    #print('x1', x1)
    y1 = SECP256k1.generator * x1
    #print('y1', y1)

    #print('\n')

    x2 = 74795400463534456695435033379044030273893345165242468307267086552055671981939
    #print('x2', x2)
    y2 = SECP256k1.generator * x2
    #print('y2', y2)

    #print('\n')

    x3 = 51060391263362785313384022851946494810511425681527536426254127238166229196713
    #print('x3', x3)
    y3 = SECP256k1.generator * x3
    #print('y3', y3)


    x4 = 51060391263362785313384022851946494810511425681527536426254127238166229196631
    #print('x4', x4)
    y4 = SECP256k1.generator * x4

    return (y1, y2, y3, y4)

def linkability(y, hash_func=hashlib.sha3_256):
    H = H2(y, hash_func=hash_func)
    #print('H',H)
    siging_key = 32076546148956423627106248222626084294972657934863549023221256992304541353107
    Y =  H * siging_key
    #print('Y',Y)
    return (Y)


data = []

def unique_rand(inicial, limit, total):

        data = []

        i = 0

        while i < total:
            number = randint(inicial, limit)
            if number not in data:
                data.append(number)
                i += 1

        return data




def main():
   
    #key generation
    k = keyGen()


    #getting pk list from server
    #a = int(sys.argv[1])
    #print(a)

    #b = int(sys.argv[2])
    #print(b)

    #c = int(sys.argv[3])
    #print(c)


    data_random = unique_rand(1, 3, 2)
    #print(data_random)
    data_random.append(0) 
    #print(data_random)

    #1st shuffel 
    data = random.sample( data_random, len(data_random) )
    #print(data)

    #2nd shuffle
    #random.shuffle(data)
    #print(data)
    #data = np.random.shuffle(data_random)
    #data = [0,1,2]
    #print(data)
    
    #writing data[0], data[1], data[2] in a text file
    f = open("/home/rimjhim/front_end/JWT_token/token_simplify/Ring/Ring_Server/pk1.txt", "w")
    f.write(str(data[0]))
    f.close()

    f1 = open("/home/rimjhim/front_end/JWT_token/token_simplify/Ring/Ring_Server/pk2.txt", "w")
    f1.write(str(data[1]))
    f1.close()

    f1 = open("/home/rimjhim/front_end/JWT_token/token_simplify/Ring/Ring_Server/pk3.txt", "w")
    f1.write(str(data[2]))
    f1.close()


    #array for key indexing
    #arr1 = [y1,y2,y3,y4]; 
    arr1 = [k[0],k[1],k[2],k[3]] 
    #print(arr1)   
     
    #Create another array arr
    arr = [];  

    if (arr1.index(arr1[0]) == int(data[0])) or (arr1.index(arr1[0]) == int(data[1])) or (arr1.index(arr1[0]) == int(data[2])):
        arr.append(arr1[0]) 
        #print(arr1[0])
    #else:
        #print('nothing')

    if (arr1.index(arr1[1]) == int(data[0])) or (arr1.index(arr1[1]) == int(data[1])) or (arr1.index(arr1[1]) == int(data[2])):
        arr.append(arr1[1])
        #print('arr1[1]',arr1[1])
    #else:
    #    print("nothing")

    if (arr1.index(arr1[2]) == int(data[0])) or (arr1.index(arr1[2]) == int(data[1])) or (arr1.index(arr1[2]) == int(data[2])):
        arr.append(arr1[2])
        #print(arr1[2])
    #else:
    #    print("nothing")

    if (arr1.index(arr1[3]) == int(data[0])) or (arr1.index(arr1[3]) == int(data[1])) or (arr1.index(arr1[3]) == int(data[2])):
        arr.append(arr1[3])
        #print(arr1[3])
    #else:
    #    print("nothing")
       
    #print('arr', arr)

    


    # reading message
    #open and read the file after the writing for message:
    f = open("/home/rimjhim/front_end/JWT_token/token_simplify/Ring/Ring_Client/resource_index.txt", "r", encoding="utf-8") 
    msg = f.read() 
    #print('message',message)
    #print('\n')
    f.close()

    #read nonce from text file (client copy)
    a_file = open("/home/rimjhim/front_end/JWT_token/token_simplify/Beacon_Service/multiple_nonce.txt", "r")
    lines = a_file.readlines()
    last_lines = lines[-1:]
    #print(last_lines)
    a_file.close()

    #writing last line of multiple nonce
    f = open("/home/rimjhim/front_end/JWT_token/token_simplify/Ring/Ring_Client/last_nonce_client.txt", "wt")
    s = last_lines
    #print('last line')
    #print(s)
    f.writelines(s)
    f.close()


    #reading last line of multiple nonce
    f = open("/home/rimjhim/front_end/JWT_token/token_simplify/Ring/Ring_Server/message_digest_client.txt", "w")
    r_1=Path('/home/rimjhim/front_end/JWT_token/token_simplify/Ring/Ring_Client/last_nonce_client.txt').read_text()
    con = r_1 
    #v_as_bytes = str.encode(con)
    message = msg + ' , ' + con
    #print("message:", message)
    f.write(message)
    f.close()
    #print('\n')

    #read private key from text file (client copy)
    x1_file = open("/home/rimjhim/front_end/JWT_token/token_simplify/Ring/Ring_Client/x1_priv_key.txt", "r")
    #x1_file=Path('x1_priv_key.txt').read_text()
    x_1 = x1_file.read()
    x1 = int(x_1)
    #print(x1)
    x1_file.close()
  
    
    #signature generation
    if (arr1.index(arr1[0]) == int(data[0])) or (arr1.index(arr1[0]) == int(data[1])) or (arr1.index(arr1[0]) == int(data[2])):
        signature = ring_signature(x1, message, arr)
        #print('\n')
        #print(("Signature is", signature))
        #print('\n')
    else:
        print("Please select your public key")


    if len(signature) == 0:
        print('error in signature generation')
    else:
        print('Ring Signature Generation Successful')

    

    #print("Signature verified:", verify_ring_signature(message, arr, *signature))


    #writing c_0
    #c_0 = 11356705072487220359082012163683036031182086511358657953866068448802648090496
    
    #writing c_0 in c_0.txt file
    f = open("/home/rimjhim/front_end/JWT_token/token_simplify/Ring/Ring_Server/c_0.txt", "w")
    #sig = str(c[0])
    #print(sig)
    dump = '{}\n'.format(signature[0])
    #print('dump',dump)
    f.write(dump)
    f.close()
    #print('\n')

    

    #writing s
    #s = [112540645418610101970280804758526738425628248753916260000775286301519278058714, 16764259080178881443914950828408339811254802940564979886703625003977150765385, 66866984651155935794782777761766946444640633771439058115935318433314852016505]

    
    #writing s in s.txt file
    f = open("/home/rimjhim/front_end/JWT_token/token_simplify/Ring/Ring_Server/s.txt", "w")
    #S = ''.join(map(lambda x: str(x) + ',', signature[1]))[:-1]
    dump1 = '{}\n'.format(signature[1])
    #print('dump',dump1)
    f.write(dump1)
    f.close()
    #print('dump1', dump1)


    sys.stdout.flush()


    
    

if __name__ == '__main__':
    main()

    
