#generate random number after 10 sec for server
import random
import time
import secrets

n = 30


while n > 0:
    number = secrets.randbits(256)
    print(number)
    f = open("multiple_nonce.txt", "a")
    s = str(number)
    f.write(s + '\n')
    f.close()
    time.sleep(1) # Delay for 1 minute (60 seconds)
    n -= 1
    


    
