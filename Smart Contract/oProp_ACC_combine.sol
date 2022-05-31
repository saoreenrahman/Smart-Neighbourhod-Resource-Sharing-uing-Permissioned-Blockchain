pragma solidity ^0.5.15;

contract oPropACC{
    
    struct object_info{
        
        string oid; //object ID
        string prop; // properties
        string cert; // certificate
        string policy; // access policies
        string metadata; // metadata
        
    }
    
     mapping(string => object_info) public oInfo;
     string[][] public data;
    
    address payable owner; //owner of the object
    address public objACC_address;
    address public objPropRep_address;
    address public oDir;
    
    
    
    constructor(address address_oDir) public {
       // Set the creator of contract as the owner
       owner = msg.sender;
       oDir = address_oDir;
    }
    
    
    modifier onlyOwner() {
        require (msg.sender == owner);
        _; //execute remaining parts from the functions where this modifier is used after doing the above check 
    }
    
	
	//Object_Information
    function registerInfo(string memory _oid, string memory _prop, string memory _cert, string memory _policy, string memory _metadata) public {
       
       oInfo[_oid].oid = _oid;
       oInfo[_oid].prop = _prop;
       oInfo[_oid].cert = _cert;
       oInfo[_oid].policy = _policy;
       oInfo[_oid].metadata = _metadata;
        
    }
	
    
    function updateInfo(string memory _oid, string memory _prop, string memory _cert, string memory _policy, string memory _metadata) public{
       oInfo[_oid].prop = _prop;
       oInfo[_oid].cert = _cert;
       oInfo[_oid].policy = _policy;
       oInfo[_oid].metadata = _metadata;
    }
    
    function deletePropertyInfo(string memory _oid) public{
        delete oInfo[_oid];
    }
    
    
    
    function getInfo (string memory _oid) public view returns (string memory _prop, string memory _cert, string memory _policy, string memory _metadata){
        return (  oInfo[_oid].prop, oInfo[_oid].cert, oInfo[_oid].policy, oInfo[_oid].metadata);
    }
	
	
	
	function selfDestruct() onlyOwner public
	{
			selfdestruct(owner);
	}
    
}
