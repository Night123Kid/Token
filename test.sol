pragma solidity ^0.8.0;

struct MintMessage {
    uint256 tokenId;
    uint256 timestamp;
    address owner;
    uint256 amount;
    address recommend;
}

interface NerdyCoderClones { 

    function parentAddress(address _myAddress) external view returns (address); 
    function getParent(address _myAddress) external view returns (address);
    // function vault(uint256 tokenId) external view returns(uint256);

    function vault(uint256 _id) external view returns (MintMessage memory);
}

contract Test{

    // function test(address _Erc721, address _recommend) public view returns(address){
    //     NerdyCoderClones qt; 
    //     qt = NerdyCoderClones(_Erc721); 
    //     return qt.parentAddress(_recommend);

    // } 

    address constant public addr = 0xFF1f321c9353c69202387B39f257F9e96Aa612A1;

    NerdyCoderClones qt; 

    constructor(){
        qt = NerdyCoderClones(addr);
    }
    function test11(uint256 tokenId) public view returns(MintMessage memory){
        
        MintMessage memory c = qt.vault(tokenId);
        return c;
    } 

    uint256[] arr = [1,2,3,4,5,6,7];

    function test () public {
        arr.pop();
    }

    function remove(uint index) public {
        arr[index] = arr[arr.length - 1];
        arr.pop();
    }

    function removeDel(uint _index) public {
        require(_index < arr.length, "index out of bound");
        for (uint i = _index; i < arr.length - 1; i++) {
            arr[i] = arr[i + 1];
        }
        arr.pop();
    }

    function getArr() public view returns(uint256[] memory) {
        return arr;
    }

    function qwe() public view returns(uint256){
        return 2*0;
    }

    function qwes() public view returns(uint256){
        uint256 q = 0;
        uint256 a = 6;
        return q*a;
    }
    


}
  