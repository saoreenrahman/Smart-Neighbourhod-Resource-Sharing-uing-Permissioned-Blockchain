# Resource-Sharing-using-Permissioned-Blockchain
In a resource sharing system users can offer goods and services with specified conditions which if satisfied, the access will be granted. In conventional resource sharing systems, users' interactions are mediated by a trusted authority (TA). As a result, TA becomes the single point of trust and has access to users' data. In addition, TA requires significant processing and management capabilities, and the ability to handle many requests simultaneously which may make it a single point of failure under various denial of service attacks. Motivated by the advantages of emerging blockchain technology, a decentralized resource sharing system was proposed which uses a permissioned blockchain based resource sharing system for allowing users to share their digital items and credentials with specified attributed-based access policies, and are enforced through a set of smart contracts. The proposed architecture offers the same required functionality while ensuring user privacy and access automation, and eliminating the requirement for the resource owner to be online. We use two cryptographic primitives, Ciphertext Policy Attribute-Based Encryption (CPABE) and ring signatures, and develop smart contracts that allow specification of the user-defined policies. We analyze security and privacy of this system, provide the description of smart contracts and construct protocols for the proposed system. 


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
