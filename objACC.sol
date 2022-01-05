pragma solidity ^0.5.15;

contract ObjACC{
    
    struct Access_control{
        bytes32 Oid; //object ID
        string cpabe_metadata; // encrypted metadata
        string access_policies; // access policies
    }
    mapping(bytes32 => Access_control) public acc;
    //Access_control[] public objAC; 
    
    address payable owner; //owner of the object
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
    
    function addAccessInfo(bytes32 _oid, string memory _CM, string memory _AP) onlyOwner public{
        acc[_oid].Oid = _oid;
        acc[_oid].cpabe_metadata = _CM;
        acc[_oid].access_policies = _AP;
    }
    
    function updateAccessInfo(bytes32 _oid, string memory _CM, string memory _AP) onlyOwner public{
        acc[_oid].Oid = _oid;
        acc[_oid].cpabe_metadata = _CM;
        acc[_oid].access_policies = _AP;
    }
    
    function deleteAccessInfo(bytes32 _oid) onlyOwner public{
        delete acc[_oid];
    }
    
    function getAccessInfo (bytes32 _oid) public view returns (string memory, string memory){
        return (acc[_oid].cpabe_metadata, acc[_oid].access_policies);
    }
    
    function setObjPropRepAddress(address _PropRep) onlyOwner public{
        objPropRep_address = _PropRep;
    }
	
	function selfDestruct() onlyOwner public
	{
			selfdestruct(owner);
	}
    
}
