pragma solidity ^0.5.15;
pragma experimental ABIEncoderV2;

contract objectProperty{
    
    
   struct object_info{
        string o_id; //object ID
        // Info regrding object Properties
        string o_Name; // object name
        string o_Owner;// user pseudonym
        string o_Desc; //description
        string o_Type; //obj typeo
       // string o_Category; //obj Category
        string o_PrimaryDesc; //obj primary description
        string o_PublishDate; //obj publish date
        string o_Cert; // certificate
        
    }
    
    mapping(string => object_info) public oInfo;
    string[][] public data;
    
    address payable owner; //owner of the object

    
    modifier onlyOwner() {
        require (msg.sender == owner);
        _; //execute remaining parts from the functions where this modifier is used after doing the above check 
    }
    
    
    //Object_Information
        function registerdata(string memory _oid, string memory _objName, string memory _OPublishDate, string memory _pid, string memory _ODesc, string memory _Otype, string memory _OPrimaryDesc, string memory _cert) public {
        object_info storage obj = oInfo[_oid];
        
        //object properties & certificate
        obj.o_Name = _objName;
        obj.o_Owner = _pid;
        obj.o_Desc = _ODesc;
        obj.o_Type = _Otype;
       // obj.o_Category = _OCategory; 
        obj.o_PrimaryDesc = _OPrimaryDesc;
        obj.o_PublishDate = _OPublishDate;
        obj.o_Cert = _cert;
        
        data.push([_objName, _oid, _Otype, _OPublishDate]) -1;
    }
	//
    
    function getdata() view public returns( string[][] memory) {
        return data;
    }
    
    
    function countdata() view public returns (uint) {
        //return objectNames.length;
        return data.length;
    }
    
     function indexdata(uint _idx) public view returns (string[] memory) {
        return data[_idx];
    }
    
    
    function updatedata(string memory _oid, string memory _objName, string memory _OPublishDate, string memory _pid, string memory _ODesc, string memory _Otype, string memory _OPrimaryDesc,  string memory _cert) public {
        object_info storage obj = oInfo[_oid];
        
        //object properties & certificate
        obj.o_Name = _objName;
        obj.o_Owner = _pid;
        obj.o_Desc = _ODesc;
        obj.o_Type = _Otype;
        //obj.o_Category = _OCategory; 
        obj.o_PrimaryDesc = _OPrimaryDesc;
        obj.o_PublishDate = _OPublishDate;
        obj.o_Cert = _cert;
        
        data.push([_objName, _oid, _Otype, _OPublishDate, _ODesc]) -1;
    }
    
    
    
    function deleteDataInfo(string memory _oid) public{
        delete oInfo[_oid];
    }
    
    function getdataInfo(string memory _oid) view public returns ( string memory, string memory, string memory,  string memory, string memory, string memory,  string memory) {
        return ( oInfo[_oid].o_Name, oInfo[_oid].o_Type,  oInfo[_oid].o_PublishDate, oInfo[_oid].o_PrimaryDesc, oInfo[_oid].o_Desc, oInfo[_oid].o_Owner, oInfo[_oid].o_Cert);
    }
    
	
	function selfDestruct() onlyOwner public
	{
			selfdestruct(owner);
	}
    
}
