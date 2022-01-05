pragma solidity ^0.5.15;

contract ObjPropRep{

    struct Properties{
        bytes32 Oid; //object ID
        string prop; // encrypted metadata
        string cert_prop; // access policies
    }
    mapping(bytes32 => Properties) public oProp;
    //Access_control[] public objAC; 
    
    address payable owner; //owner of the object
    address public objACC_address;
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
    
    function setPropertyInfo(bytes32 _oid, string memory _prop, string memory _cert) onlyOwner public{
        oProp[_oid].Oid = _oid;
        oProp[_oid].prop = _prop;
        oProp[_oid].cert_prop = _cert;
    }
    
    function updatePropertyInfo(bytes32 _oid, string memory _prop, string memory _cert) onlyOwner public{
        oProp[_oid].prop = _prop;
        oProp[_oid].cert_prop = _cert;
    }
    
    function deletePropertyInfo(bytes32 _oid) onlyOwner public{
        delete oProp[_oid];
    }
    
    function setObjACCAddress(address _oACC) onlyOwner public{
        objACC_address = _oACC;
    }
    
    function getPropertyInfo (bytes32 _oid) public view returns (string memory, string memory){
        return (oProp[_oid].prop, oProp[_oid].cert_prop);
    }
	
	function selfDestruct() onlyOwner public
	{
			selfdestruct(owner);
	}
    
}
