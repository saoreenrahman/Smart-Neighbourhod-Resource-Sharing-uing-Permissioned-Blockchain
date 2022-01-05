pragma solidity ^0.5.15;

contract oDir{
    //controlled by BA only but accessible by any user
   // bytes32[] Oid; // object id
    struct objDescription{
        bytes32 Oid; // object id
        string  pid;// user pseudonym
        address pk; //user public key
        string  ODesc;// object description
        address address_objACC; //ObjACC contract address and ABI
        string abi_objACC;
        address address_objPropRep; //ObjPropRep contract address and ABI
        string abi_objPropRep;
        // object state
    }
    mapping(bytes32 => objDescription) public objects;
    //objDescription[] public objects; //array of objects
    
    address payable BA; //owner of the oDir contract
    address public Adj;
    //uint index;
    
    constructor(address address_Adj) public{
       // Set Blockchain authority as the owner of this contract
       BA = msg.sender;
       Adj = address_Adj; //setting the adjuducator contract address
       //index = 0;
    }
    
    modifier onlyBA() {
        require (msg.sender == BA);
        _; //execute remaining parts from the functions where this modifier is used after doing the above check 
    }
    
    function registerResource (bytes32 _oid, string memory _pid, string memory _oDesc, address _objACC, string memory _abiObjACC, address _objPropRep, string memory _abiObjPropRep) public {
        objects[_oid].Oid = _oid;
        objects[_oid].pid = _pid;
        objects[_oid].pk = msg.sender;
        objects[_oid].ODesc = _oDesc;
        objects[_oid].address_objACC = _objACC;
        objects[_oid].abi_objACC = _abiObjACC;
        objects[_oid].address_objPropRep = _objPropRep;
        objects[_oid].abi_objPropRep = _abiObjPropRep;
    }
    
    function updateResource (bytes32 _oid, string memory _oDesc) public {
        require (objects[_oid].pk == msg.sender,"Not resource owner");
        objects[_oid].ODesc = _oDesc;
    }
    
    function deleteResource (bytes32 _oid) public{
        require (msg.sender == Adj || msg.sender == objects[_oid].pk,"Not authorized user");
        delete objects[_oid];
    }
    
    function getAdvertiseInfo (bytes32 _oid) public view returns (bytes32, string memory, address, string memory){
        return (objects[_oid].Oid, objects[_oid].pid, objects[_oid].pk, objects[_oid].ODesc);
    }
    
    function getContractInfo (bytes32 _oid) public view returns (address, string memory, address, string memory){
        return (objects[_oid].address_objACC, objects[_oid].abi_objACC,objects[_oid].address_objPropRep,objects[_oid].abi_objPropRep);
    }
	
	function selfDestruct() onlyBA public
	{
			selfdestruct(BA);
	}
    
}
