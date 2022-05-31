pragma solidity ^0.5.15;

contract Adj{
    //works as judge to detect misbehaviour
    address payable BA; //owner of the contract
    
    struct Misbehavior
	{
		bytes32 Oid; //
		string pk;//public key of user who performed the misbehavior;
		string misbehavior; //misbehavior type
		uint time;	//time of the Misbehavior occured
		string misb_state;
		//uint penalty;	//penalty (number of minitues blocked);
	}
	mapping (address => Misbehavior[]) public MisbehaviorList;
	//mapping(bytes32 => Misbehavior) public misb;
	
	address[] public Verifiers; //array to store verfiers addresses
	uint index;
    
    constructor() public{
       // Set Blockchain authority as the owner of this contract
       BA = msg.sender;
       index = 0;
    }
    
    modifier onlyBA() {
        require (msg.sender == BA);
        _; //execute remaining parts from the functions where this modifier is used after doing the above check 
    }
    
    function registerVerifier (address _verifier) onlyBA public {
        Verifiers[index] = _verifier;
        index = index + 1;
    }
    
    //address subject;//subject who performed the misbehavior;
    function reportMisbehavior (address _subject, bytes32 _oid, string memory _pk, string memory _misb, uint _time) public{
       MisbehaviorList[_subject].push(Misbehavior(_oid, _pk, _misb, _time, "unchecked"));
    }
    
    function setMisbehaviorState (address _key) public {
        uint latest = MisbehaviorList[_key].length - 1;
        MisbehaviorList[_key][latest].misb_state = "checked";
    }
    
    function getLatestMisbehavior (address _key) public view returns (string memory _subject, bytes32 _object,  string memory _misbehavior, uint _time, string memory _state){
        uint latest = MisbehaviorList[_key].length - 1;
		//uint latest = 0;
		_subject = MisbehaviorList[_key][latest].pk;
		_object = MisbehaviorList[_key][latest].Oid;
		//_action = MisbehaviorList[_key][latest].action;
		_misbehavior = MisbehaviorList[_key][latest].misbehavior;
		_time = MisbehaviorList[_key][latest].time;
		_state = MisbehaviorList[_key][latest].misb_state;
    } 

	function selfDestruct() onlyBA public
	{
			selfdestruct(BA);
	}
}
