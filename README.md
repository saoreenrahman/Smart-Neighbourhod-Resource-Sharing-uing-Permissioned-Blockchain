# Resource-Sharing-using-Permissioned-Blockchain
A resource sharing using permissioned blockchain is an approach to empower neighborhoods to engage in the sharing economy and enjoy all the benefits of sharing goods and resources, creating a closer community as well. Theis work provides an infrastructure for a neighborhood to allow home users to share their resources according to their personal preferences (policies). To do so, two cryptographic primitives have been used: "Ciphertext Policy Attribute-based Encryption (CPABE)" to cryptographically enforce  access control and  the "ring signature" for ensuring anonymous authentication and access to resources. "CPABE" is used to provide access control and "ring signature" is used to anonymize user accesses to the blockchan and so provide privacy for browsing. Users of this system interact with it as resource owners, (Ro) or resource requesters, (Rr). Resource owners can advertise their resources while resource requester can access those resources anonymously. Resource owners upload their encrypted resource in the cloud and store the certificates for the resource properties and the encrypted links of resource information on the blockchain. On the other hand, resource requesters anonymously retrieve the information of the resource and the encrypted link from the blockchain. With the help of "CPABE", "ring signature" and blockchain associated with smart contracts, the proposed system enforces advertisement of shareable resources with predefined access policies and trustworthy access request evaluation.

System Architecture:

![system_architecture](https://user-images.githubusercontent.com/93157246/171309525-f5950664-a32c-417d-aa71-d9b76bd8cccf.png)


User Interaction Flow Diagram:
![user_interaction_flow](https://user-images.githubusercontent.com/93157246/171309528-e4059a83-4769-44eb-ae67-6b1981f1a871.png)


Implementation Overview:

![implementation_overview](https://user-images.githubusercontent.com/93157246/171310113-a9377640-7a2a-4c7b-bc29-976d0b324984.png)


Requirements:
Cryptographic Libraries:

  1. OpenSSL library
  
  2. CPABE toolkit (Support Cyphertext Policy Attribute Based Encryption,link: https://acsc.cs.utexas.edu/cpabe/)
  
  3. CEDSA library
  
  4. Ring Signature (links: https://link.springer.com/chapter/10.1007/3-540-45682-1_32 , https://eprint.iacr.org/2004/027.pdf)
  
Software Requirements:

  1. Node.js
  
  2. MySQL
  
  3. Python
  
  4. Go-Ethereum(geth),
     Libraries: web3js
   
  Instructions:
  
  1.Run local geth nodes by creating private Ethereum network. 
    (link: https://medium.com/swlh/how-to-set-up-a-private-ethereum-blockchain-c0e74260492c)
    
  2. Use Remix IDE(https://remix.ethereum.org/) to run all the smart contracts.
  3. Use Node.js to execute "proxy_server.js" and "client_side.js" 
  4. Use python (version>3) to run python codes.

N.B. this work is an extended version of "Privacy-Preserving Resource Sharing Using Permissioned Blockchains: (The Case of Smart Neighbourhood)" (link: https://www.researchgate.net/publication/354643209_Privacy-Preserving_Resource_Sharing_Using_Permissioned_Blockchains_The_Case_of_Smart_Neighbourhood)
