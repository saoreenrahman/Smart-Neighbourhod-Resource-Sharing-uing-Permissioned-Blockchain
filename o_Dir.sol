pragma solidity ^0.5.15;
pragma experimental ABIEncoderV2;

contract oDir {
    
    struct ObjectInfo {
        //uint obj;
        string objName; // object name
        string  pid;// user pseudonym
        address pk; //user public key
        string  ODesc; //description
        string oid; //obj id
        address address_objACC; //ObjACC contract address and ABI
        string abi_objACC;
        address address_objPropRep; //ObjPropRep contract address and ABI
        string abi_objPropRep;
    }
    
     struct ObjectInfo1 {
        //uint obj;
        string objName; // object name
        string  pid;// user pseudonym
        address pk; //user public key
        string  ODesc; //description
        string oid; //obj id
        string otype; //obj typeo
        string ocategory; //obj Category
        string oPrimaryDesc; //obj primary description
        string oPublishDate; //obj publish date
        

        address address_objACC; //ObjACC contract address and ABI
        string abi_objACC;
        address address_objPropRep; //ObjPropRep contract address and ABI
        string abi_objPropRep;
    }
    
    //mapping (address => Instructor) instructors;
    mapping (string => ObjectInfo) objects;
    mapping (string => ObjectInfo1) objt;
    //address[] public instructorAccts;
    string[] public objectNames;
    string[2][] public oName;
    string[][] public data;
    
    
    function registerObject(string memory _name, string memory _oid, address _pk, string memory _objName, string memory _pid, string memory _ODesc,  address _objACC, string memory _abiObjACC, address _objPropRep, string memory _abiObjPropRep) public {
        ObjectInfo storage obj = objects[_name];
        
        
        obj.objName = _objName;
        obj.pid = _pid;
        obj.ODesc = _ODesc;
        obj.pk = _pk;
        obj.oid = _oid;
        
        obj.address_objACC = _objACC;
        obj.abi_objACC = _abiObjACC;
        obj.address_objPropRep = _objPropRep;
        obj.abi_objPropRep = _abiObjPropRep;
        
        objectNames.push(_name) -1;
        oName.push([_name,_oid]) -1;
        //data.push([_name,_oid, _ODesc]) -1;
    }
    
    
    
    function getObjects() view public returns( string[2][] memory) {
        //return objectNames;
        return oName;
    }
    
    
    /*
    function getObjectInfo(string memory _name) view public returns ( bytes32, string memory, address, string memory, string memory, address, address ) {
        return (objects[_name].oid, objects[_name].objName, objects[_name].pk, objects[_name].ODesc, objects[_name].pid, objects[_name].address_objACC,objects[_name].address_objPropRep);
    }
    */
    
    function getObjectInfo(string memory _name) view public returns ( string memory, string memory, address, string memory, string memory ) {
        return (objects[_name].oid, objects[_name].objName, objects[_name].pk, objects[_name].ODesc, objects[_name].pid);
    }
    
    function getObjectContractInfo(string memory _name) view public returns ( string memory, string memory,  address, string memory, address, string memory ) {
        return (objects[_name].objName, objects[_name].oid, objects[_name].address_objACC, objects[_name].abi_objACC, objects[_name].address_objPropRep, objects[_name].abi_objPropRep);
    }
    
    function countObjectss() view public returns (uint) {
        //return objectNames.length;
        return oName.length;
    }
    
    //code for data[][] array
    
    function registerdata(string memory _oid, string memory _objName, string memory _OPublishDate, string memory _pid, string memory _ODesc, string memory _Otype, string memory _OPrimaryDesc, string memory _OCategory) public {
        ObjectInfo1 storage obj = objt[_oid];
        
        
        obj.objName = _objName;
        obj.pid = _pid;
        obj.ODesc = _ODesc;
        
        
        obj.otype = _Otype;
        obj.ocategory = _OCategory; 
        obj.oPrimaryDesc = _OPrimaryDesc;
        obj.oPublishDate = _OPublishDate;
        
        
        //obj.address_objACC = _objACC;
        //obj.abi_objACC = _abiObjACC;
        //obj.address_objPropRep = _objPropRep;
        //obj.abi_objPropRep = _abiObjPropRep;
        
        
        data.push([_objName, _oid, _Otype, _OPublishDate, _OCategory]) -1;
    }
    
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
    
     function getdataInfo(string memory _oid) view public returns ( string memory, string memory, string memory,  string memory, string memory, string memory,  string memory ) {
        return ( objt[_oid].objName, objt[_oid].otype,   objt[_oid].oPublishDate, objt[_oid].ocategory, objt[_oid].oPrimaryDesc, objt[_oid].ODesc, objt[_oid].pid);
    }
    
    function deleteData(string memory _oid) public{
        delete objt[_oid];
    }
    
}
