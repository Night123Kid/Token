// SPDX-License-Identifier: GPL-3.0

// Created by HashLips
// The Nerdy Coder Clones

pragma solidity ^0.8.0;

import "./contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./contracts/access/Ownable.sol";
import "./contracts/token/ERC20/utils/SafeERC20.sol";
import "./contracts/token/ERC20/utils/SafeMath.sol";

contract TokenWrapper {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    IERC20 public tokenAddr;
    uint256 private _totalMint;
    mapping(address => uint256) private _balances;

    function balanceOfErc20Token(address account) public view returns (uint256) {
        return _balances[account];
    }

    function tokenTransfer(uint256 amount, address _to) public {
        tokenAddr.safeTransferFrom(msg.sender, _to, amount);
    }

    function withdrawErc20Token(uint256 amount) public {
        require(amount <= _totalMint, "amount error");
        _totalMint = _totalMint.sub(amount);
        _balances[msg.sender] = _balances[msg.sender].sub(amount);
        tokenAddr.safeTransfer(msg.sender, amount);
    }
}

contract NerdyCoderClones is ERC721Enumerable, Ownable, TokenWrapper {

  using Strings for uint256;
  using SafeMath for uint256;

  string private baseURI;
  string public baseExtension = ".json";
  uint256[] public constArr = [100000000000000000000, 70000000000000000000, 33000000000000000000, 20000000000000000000];
  uint256[] public startTimeArr = [1655882192,1655884592,1655877992,1655879192];
  uint256[] public sellAmountArr = [2,2,2,102];
  uint256 public maxSupply = 300;
  uint256 public maxMintAmount = 1;
  bool public paused = false;
  address public recommendAddress;
  mapping(address => address) public parentAddress;

  struct MintMessage {
    uint256 tokenId;
    uint256 timestamp;
    address owner;
    uint256 amount;
    address recommend;
  }
  mapping(uint256 => MintMessage) public vault; 

  constructor(
    string memory _name,
    string memory _symbol,
    string memory _initBaseURI,
    address _recommend
  ) ERC721(_name, _symbol) {
    setBaseURI(_initBaseURI);
    tokenAddr = IERC20(0x202AA1e9E8D4A226DdFD3564efe65c3CcA5df696);
    recommendAddress = _recommend;
  }

  // internal
  function _baseURI() internal view virtual override returns (string memory) {
    return baseURI;
  }

  function getStage() public view returns(uint256 stage){
    uint256 currentTime = block.timestamp;
    require(block.timestamp >= startTimeArr[0],"not start");
    uint256 i;
    if(currentTime >= startTimeArr[0] && currentTime < startTimeArr[1]){
      i = 1;
    } else if(currentTime >= startTimeArr[1] && currentTime < startTimeArr[2]){
      i = 2;
    } else if(currentTime >= startTimeArr[2] && currentTime < startTimeArr[3]){
      i = 3;
    } else if(currentTime >= startTimeArr[3]){
      i = 4;
    }
    return i;
  }

  // public
  function mint(address _to, address _recommend, uint256 _mintAmount) public {
    uint256 _i = getStage();
    uint256 total;
    for(uint256 j = 0; j< _i; j++){
      total += sellAmountArr[j];
    }
    if(_i == startTimeArr.length){
      require(block.timestamp >= startTimeArr[_i - 1],"not start");
      require(totalSupply() + _mintAmount <= maxSupply,"sold out");
    } else {
      require(block.timestamp >= startTimeArr[_i - 1],"not start");
      require(block.timestamp < startTimeArr[_i],"not start");
      require(totalSupply() + _mintAmount <= total,"Sold out at the current stage");
    }
    uint256 supply = totalSupply();
    require(!paused);
    require(_mintAmount > 0);
    require(_mintAmount <= maxMintAmount);
    require(supply + _mintAmount <= maxSupply);
    uint256[] memory walletArr = walletOfOwner(_to);
    require(walletArr.length < 1, "only one");
    if(address(_recommend) != address(recommendAddress)){
      uint256[] memory recommendArr = walletOfOwner(_recommend);
      require(recommendArr.length > 0, "recommend must have one");
    }
    
    // if (msg.sender != owner()) {
    uint256 burnAmount;
    uint256 recommendReward;

    burnAmount = constArr[_i - 1].mul(_mintAmount).mul(90).div(100);
    recommendReward = constArr[_i - 1].mul(_mintAmount).mul(10).div(100);

    super.tokenTransfer(burnAmount, address(0xdead));
    super.tokenTransfer(recommendReward, _recommend);
        
    // }
    parentAddress[_to] = _recommend;


    _safeMint(_to, supply + 1);

    vault[supply + 1] = MintMessage({
      
      tokenId: supply + 1,
      timestamp: block.timestamp,
      owner: _to,
      amount: constArr[0],
      recommend: _recommend

    });
 
  }

  function walletOfOwner(address _owner)
    public
    view
    returns (uint256[] memory)
  {
    uint256 ownerTokenCount = balanceOf(_owner);
    uint256[] memory tokenIds = new uint256[](ownerTokenCount);
    for (uint256 i; i < ownerTokenCount; i++) {
      tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
    }
    return tokenIds;
  }

  function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override
    returns (string memory)
  {
    require(
      _exists(tokenId),
      "ERC721Metadata: URI query for nonexistent token"
    );

    string memory currentBaseURI = _baseURI();
    return bytes(currentBaseURI).length > 0
        ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension))
        : "";
  }

  //only owner
  function setCost(uint256 _newCost,uint256 _stage) public onlyOwner {
    constArr[_stage] = _newCost;
  }

  //only owner
  function setStartTime(uint256 _newTime,uint256 _stage) public onlyOwner {
    startTimeArr[_stage] = _newTime;
  }

  //only owner
  function setSellAmount(uint256 _newAmount, uint256 _stage) public onlyOwner {
    sellAmountArr[_stage] = _newAmount;
  }

  function setmaxMintAmount(uint256 _newmaxMintAmount) public onlyOwner {
    maxMintAmount = _newmaxMintAmount;
  }

  function setBaseURI(string memory _newBaseURI) public onlyOwner {
    baseURI = _newBaseURI;
  }

  function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
    baseExtension = _newBaseExtension;
  }

  function pause(bool _state) public onlyOwner {
    paused = _state;
  }

  function withdraw() public payable onlyOwner {
    require(payable(msg.sender).send(address(this).balance));
  }

  function withdrawToken() public onlyOwner {

    uint256 amount = super.balanceOfErc20Token(address(this));
    super.withdrawErc20Token(amount);

  }

  function rescue(address to_, IERC20 token_, uint256 amount_) external onlyOwner{
    require(to_ != address(0), "must not 0");
    require(amount_ > 0, "must gt 0");

    token_.transfer(to_, amount_);
  }

  function getRemains() public view returns(uint256) {
    uint256 _i = getStage();
    uint256 total = 0;
    for(uint256 j = 0; j < _i; j++){
      total += sellAmountArr[j];
    }
    uint256 totalSupply = totalSupply();
    return total.sub(totalSupply);
  }

  function getParent(address _address) external view returns(address){
    return parentAddress[_address];
  }

}
