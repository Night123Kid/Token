// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

// import "./contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./contracts/access/Ownable.sol";
import "./contracts/token/ERC20/utils/SafeERC20.sol";
import "./contracts/token/ERC20/utils/SafeMath.sol";

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
    function vault(uint256 _id) external view returns (MintMessage memory);
    function ownerOf(uint256 _tokenId) external view returns (address); 

    function transferFrom(address _from, address _to, uint256 _tokenId) external;

    function constArr(uint256 stage) external view returns (uint256);
    function sellAmountArr(uint256 stage) external view returns (uint256);
    
}

contract TokenWrapper is Ownable{
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

contract StakingPool is TokenWrapper{
    // using Strings for uint256;
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    NerdyCoderClones public NftToken;
    IERC20 public rewardToken;

    address public firstRecommend = address(0x90b9CA578a1b9932Da1C90EbF6e874b8E1f28a1e);
    uint256 public constant DURATION = 25_920_000; // 300day
    uint256 public startTime;
    uint256[] public rateArr = [20, 10, 5];
    uint256 public totalStake = 0;

    struct StakeInfo {
        uint256 tokenId;
        uint256 timestamp;
        uint256 amount;
        uint256 endTime;
    }

    struct rewardInfo {
        uint256 tokenId;
        uint256 lastUpdateTime;
        uint256 endTime;
        uint256 rewardRate;
    }

    mapping(address => rewardInfo[]) public rewardMessage;

    mapping(uint256 => StakeInfo) public stakeMessage; 
    mapping(address => bool) public staked;
    mapping(address => uint256) public rewardRate;
    mapping(address => uint256) public stakeTokenId;
    mapping(uint256 => uint256) public costWithTokenId;

    constructor(address _trc20, address _nft, uint256 _startTime) public{
        startTime = _startTime;
        NftToken = NerdyCoderClones(_nft);
        rewardToken = IERC20(_trc20);
    }

    modifier checkStart() {
        require(block.timestamp >= startTime,"not start");
        _;
    }
    
    function getAmount(uint256 tokenId) internal view returns(uint256){
        // MintMessage memory info = NftToken.vault(tokenId);
        if(getCostWithTokenId(tokenId) > 0){
            return getCostWithTokenId(tokenId);
        }
        uint stage = 0;
        uint256 min = 0;
        uint256 max = 0;
        while( true ){
            if(stage > 0){
                // min = NftToken.sellAmountArr(stage - 1);
                min += NftToken.sellAmountArr(stage - 1);
            }
            max += NftToken.sellAmountArr(stage);
            if(tokenId > min && tokenId <= max){
                break;
            }
            stage++;
            
        }
        return NftToken.constArr(stage);
    }

    function setFirstRecommend(address _firstRecommend) public onlyOwner {
        firstRecommend = _firstRecommend;
    }

    //only owner
    function setRateByLevel(uint level, uint256 rate) public onlyOwner {
        rateArr[level] = rate;
    }

    function getRateByLevel(uint level) public view returns (uint256) {
        return rateArr[level];
    }

    function setCostWithTokenId(uint256 tokenId, uint256 _cost) public onlyOwner{
       costWithTokenId[tokenId] = _cost;
    }

    
    function getCostWithTokenId(uint256 tokenId) public view returns (uint256) {
        return costWithTokenId[tokenId];
    }

    function stake(uint256 tokenId) public  checkStart {
        require(staked[msg.sender] == false, "only stake one");
        require(NftToken.ownerOf(tokenId) == msg.sender,"not owner");

        address recommendAddress = NftToken.parentAddress(msg.sender);
        require(recommendAddress != address(0xdead),"recommendAddress must be");
        // MintMessage memory info = NftToken.vault(tokenId);
        uint256 amount = getAmount(tokenId);
        uint256 stakeStartTime = block.timestamp;
        uint256 endTime = stakeStartTime.add(DURATION);
        stakeMessage[tokenId] = StakeInfo({
            tokenId: tokenId,
            timestamp: stakeStartTime,
            amount: amount,
            endTime: endTime
        });
        staked[msg.sender] = true;
        stakeTokenId[msg.sender] = tokenId;
        rewardRate[msg.sender] = amount.mul(1).div(100).div(24*60*60);
        totalStake++;
        // if(msg.sender != firstRecommend){
        pushRewardMessage(tokenId, msg.sender, endTime, stakeStartTime);
        // }
    }

    function lastTimeRewardApplicable(uint256 _endTime) public view returns (uint256) {
        return Math.min(block.timestamp, _endTime);
    }

    function getOwnEarned(address account) public view returns(uint256){
        uint256 tokenId = stakeTokenId[account];
        StakeInfo memory info = stakeMessage[tokenId];
        uint256 timestamp = info.timestamp;
        uint256 ownEarn = lastTimeRewardApplicable(info.endTime).sub(timestamp).mul(rewardRate[account]);
        return ownEarn;
    }

    function getRecommendEarned(address account) public view returns (uint256) {
        uint256 earned;
        for(uint i = 0; i < rewardMessage[account].length; i++){
            uint256 endtime = rewardMessage[account][i].endTime;
            uint256 lastUpdateTime = rewardMessage[account][i].lastUpdateTime;
            uint256 rewardRate = rewardMessage[account][i].rewardRate;
            earned += lastTimeRewardApplicable(endtime).sub(lastUpdateTime).mul(rewardRate);
        }
        return earned;
    }


    function pushRewardMessage(uint256 tokenId, address account, uint256 endTime, uint256 updateTime) internal {
        // require(account != address(firstRecommend),"error address");
        uint rateLevel = 0;
        address parent;
        address _account = account;
        while(true){
            parent = NftToken.parentAddress(_account);
            if(parent == address(0xdead) || rateLevel > 2){
               break;
            }
            rewardInfo memory message;
            message.tokenId = tokenId;
            message.lastUpdateTime = updateTime;
            message.endTime = endTime;
            message.rewardRate = rewardRate[account].mul(rateArr[rateLevel]).div(100);
            rewardMessage[parent].push(message);
            rateLevel++;
            _account = parent;
        }
        // address parentOne = NftToken.parentAddress(account);
        // uint256 rewardRateOne = rewardRate[account].mul(rateOne).div(100);

        // rewardInfo memory message;
        // message.tokenId = tokenId;
        // message.lastUpdateTime = updateTime;
        // message.endTime = endTime;
        // message.rewardRate = rewardRateOne;
        // rewardMessage[parentOne].push(message);

        // address parentTwo;
        // if(parentOne != address(firstRecommend)){
        //     parentTwo = NftToken.parentAddress(parentOne);
        //     uint256 rewardRateTwo = rewardRate[parentOne].mul(rateTwo).div(100);
        //     message.rewardRate = rewardRateTwo;
        //     rewardMessage[parentTwo].push(message);
        // }

        // address parentThree;
        // if(parentTwo != address(firstRecommend)){
        //     parentThree = NftToken.parentAddress(parentTwo);
        //     uint256 rewardRateThree = rewardRate[parentTwo].mul(rateThree).div(100);
        //     message.rewardRate = rewardRateThree;
        //     rewardMessage[parentThree].push(message);
        // }   
    }

    function updateReward(address account) internal {
        uint256 tokenId = stakeTokenId[account];
        for(uint256 i = 0; i < rewardMessage[account].length; i++){
            rewardMessage[account][i].lastUpdateTime = block.timestamp;
        }
        if(uint256(tokenId) != uint256(0)){
            stakeMessage[tokenId].timestamp = uint256(block.timestamp);
        }
    }

    function getReward() public checkStart {
        // uint256 tokenId = stakeTokenId[msg.sender];
        uint256 trueReward;
        if(staked[msg.sender]){
            trueReward += getOwnEarned(msg.sender);
        }
        trueReward += getRecommendEarned(msg.sender);
        require(trueReward > 0);
        updateReward(msg.sender);
        if (trueReward > 0) {
            rewardToken.safeTransfer(msg.sender, trueReward);
        }
    }

    function rescue(address to_, IERC20 token_, uint256 amount_) external onlyOwner{
        require(to_ != address(0), "must not 0");
        require(amount_ > 0, "must gt 0");
        token_.transfer(to_, amount_);
    }

    // function updateRate(uint256 stage, uint256 _rate) public onlyOwner{
    //     if(stage == 1){
    //         rateOne = _rate;
    //     } else if(stage == 2){
    //         rateTwo = _rate;
    //     } else if(stage == 3){
    //         rateThree = _rate;
    //     }
    // }

}