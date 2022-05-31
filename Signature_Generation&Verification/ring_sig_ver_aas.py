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


def main():
   
    k = keyGen()
    
    
    #arr1 = [y1,y2,y3,y4]; 
    arr1 = [k[0],k[1],k[2],k[3]] 
    #print(arr1)   
     
    #getting pk from server

    #read value of "a" from text file
    f = open("/home/rimjhim/front_end/JWT_token/token_simplify/Ring/Ring_Server/pk1.txt", "r")
    aa = f.read()
    a = int(aa)
    #print('aa',aa)
    #print('a',a)
    f.close()

   
   #read value of "b" from text file
    f = open("/home/rimjhim/front_end/JWT_token/token_simplify/Ring/Ring_Server/pk2.txt", "r")
    bb = f.read()
    b = int(bb)
    #print('bb',bb)
    #print('b',b)
    f.close()
    

    #read value of "c" from text file
    f = open("/home/rimjhim/front_end/JWT_token/token_simplify/Ring/Ring_Server/pk3.txt", "r")
    cc = f.read()
    c = int(cc)
    #print('cc',cc)
    #print('c',c)
    f.close()


    #Create another array arr
    arr = []; 

    #Create array arr
    if (arr1.index(arr1[0]) == a) or (arr1.index(arr1[0]) == b) or (arr1.index(arr1[0]) == c):
        arr.append(arr1[0]) 
        #print(arr1[0])
    #else:
        #print('nothing')

    if (arr1.index(arr1[1]) == a) or (arr1.index(arr1[1]) == b) or (arr1.index(arr1[1]) == c):
        arr.append(arr1[1])
        #print('arr1[1]',arr1[1])
    #else:
    #    print("nothing")

    if (arr1.index(arr1[2]) == a) or (arr1.index(arr1[2]) == b) or (arr1.index(arr1[2]) == c):
        arr.append(arr1[2])
        #print(arr1[2])
    #else:
    #    print("nothing")

    if (arr1.index(arr1[3]) == a) or (arr1.index(arr1[3]) == b) or (arr1.index(arr1[3]) == c):
        arr.append(arr1[3])
        #print(arr1[3])
    #else:
    #    print("nothing")
       
    #print('arr', arr)
  

    #x = [x1,x2,x3]
    #y = [y1,y2,y3]   

    #print('\n')
    #print('x', x)
    #print('y', y)
    #print('\n')


    #reading message
    m_file = open("/home/rimjhim/front_end/JWT_token/token_simplify/Ring/Ring_Server/message_digest_client.txt", "r")
    message = m_file.read()
    m_file.close()
    #print('\n')

  


    #writing and reading c_0
    #c_0 = 11356705072487220359082012163683036031182086511358657953866068448802648090496

    #read signature (c_0) from text file (auth)
    c0_file = open("/home/rimjhim/front_end/JWT_token/token_simplify/Ring/Ring_Server/c_0.txt", "r")
    c0 = c0_file.read()
    c_0 = int(c0)
    #print('c_0',c_0)
    c0_file.close()

    

    #writing and reading s
    #s = [112540645418610101970280804758526738425628248753916260000775286301519278058714, 16764259080178881443914950828408339811254802940564979886703625003977150765385, 66866984651155935794782777761766946444640633771439058115935318433314852016505]

    #read signature (s) from text file (auth)
    s_file = open("/home/rimjhim/front_end/JWT_token/token_simplify/Ring/Ring_Server/s.txt", "r")
    #s_0 = s_file.readlines()
    for line in s_file.readlines():
        currentline = line.split()

        #for s0
        a = currentline[0]
        aa = a.replace(',', '')
        aaa = aa.replace('[', '')
        s0 = int(aaa)

        #for s1
        b = currentline[1]
        bb = b.replace(',', '')
        #bbb = bb.replace('[', '')
        s1 = int(bb)

        #for s2
        c = currentline[2]
        cc = c.replace(',', '')
        ccc = cc.replace(']', '')
        s2 = int(ccc)

    s = [s0, s1, s2]
    #print('s',s)
    s_file.close()

    
    Y = linkability(arr)

    
    
    #print("Signature Verification:", verify_ring_signature(message, arr, c_0, s, Y))
    verify = verify_ring_signature(message, arr, c_0, s, Y)
    #print(verify)


    import server_nonce_verify as v
    out = v.nonce_ver()
    #print(out)
    

    if out == 1 and verify == True :
        print('1')
        #return 1
    else:
        print('0')
        #return 0


    sys.stdout.flush()


    
    

#if __name__ == '__main__':
main()

    
