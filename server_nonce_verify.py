
def nonce_ver():
	a_file = open("/home/rimjhim/front_end/JWT_token/token_simplify/Beacon_Service/multiple_nonce.txt", "r")
	lines = a_file.readlines()
	last_lines = lines[-1:]
	last_two_lines = lines[-2:-1]
	a_file.close()

	f = open("/home/rimjhim/front_end/JWT_token/token_simplify/Ring/Ring_Server/last_nonce_server.txt", "wt")
	s0 = last_lines
	#print('last line')
	#print(s0)
	f.writelines(s0)
	f.close()

	f = open("/home/rimjhim/front_end/JWT_token/token_simplify/Ring/Ring_Server/second_last_nonce_client.txt", "wt")
	s1 = last_two_lines
	#print('second last line:')
	#print(s1)
	f.writelines(s1)
	f.close()

	#reading last nonce
	nonce_s0 = open("/home/rimjhim/front_end/JWT_token/token_simplify/Ring/Ring_Server/last_nonce_server.txt", "r")
	n_s0 = nonce_s0.read()
	n_s_0 = int(n_s0)
	#print(n_s_0)
	nonce_s0.close()

	#reading 2nd last nonce
	nonce_s1 = open("/home/rimjhim/front_end/JWT_token/token_simplify/Ring/Ring_Server/second_last_nonce_client.txt", "r")
	n_s1 = nonce_s1.read()
	n_s_1 = int(n_s1)
	#print(n_s_1)
	nonce_s0.close()

	#reading message digest from client
	msg_client = open("/home/rimjhim/front_end/JWT_token/token_simplify/Ring/Ring_Server/message_digest_client.txt", "r")
	msg = msg_client.read()
	n = msg.split(",")[-1]
	nonce = int(n)
	#print(msg)
	#print(nonce)
	msg_client.close()


	if nonce == n_s_0 or nonce == n_s_1:
		#print('nonce,n_s_0, n_s_1',nonce,n_s_0, n_s_1)
		#print('valid nonce')	
		return 1
	else:
		#print('invalid nonce')
		return 0
		
#nonce_ver()
