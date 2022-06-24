const fs = require("fs")
const path = require("path")
const image = require("imageinfo"); //引用imageinfo模块


// function readFileList(path, filesList) {
    
//     var files = fs.readdirSync(path);
//     files.forEach(function (itm, index) {

//         var stat = fs.statSync(path + itm);
//         if (stat.isDirectory()) {

//         //递归读取文件
//             readFileList(path + itm + "/", filesList)
//         } else {

//             var obj = {};//定义一个对象存放文件的路径和名字
//             obj.path = path;//路径
//             obj.filename = itm//名字
//             filesList.push(obj);
//         }
//     })

// }


// var getFiles = {

//     //获取文件夹下的所有文件
//     getFileList: function (path) {
    
//         var filesList = [];
//         readFileList(path, filesList);
//         return filesList;
//     },
//     //获取文件夹下的所有图片
//     getImageFiles: function (path) {
//         var imageList = [];

//         this.getFileList(path).forEach((item) => {		
//             var ms = image(fs.readFileSync(item.path + item.filename));
//             console.log(ms);
//             ms.mimeType && (imageList.push(item.filename))
//         });
//         console.log(imageList);

        
//     }
// };


// getFiles.getImageFiles('./data/images/');


let imageList = [
    '白起.jpg',          '曹操.jpg',
    '蚩尤.jpg',         '貂蝉.jpg',
    '黄药师.jpg',    '霍去病.jpg',
    '姜子牙.jpg',      '李靖.jpg',
    '李斯.jpg',           '刘备.jpg',
    '吕布.jpg',           '孟婆.jpg',
    '灭绝师太.jpg',         '盘古.jpg',
    '司马穰苴.jpg',         '商鞅.jpg',
    '神农.jpg',       '司马迁.jpg',
    '孙权.jpg',        '上官婉儿.jpg',
    '卫青.jpg',        '东方不败.jpg',
    '武则天.jpg',       '项羽.jpg',
    '西施.jpg',          '岳飞.jpg',
    '张飞.jpg',       '赵飞燕.jpg',
    '王昭君.jpg',        '赵云.jpg',
    '关羽.jpg', '秦始皇.jpg',
    '诸葛亮.jpg'
  ]


  for(let i = 0; i < imageList.length; i++ ){

    let obj = {
        name: imageList[i].split(".")[0] ,
        image: "https://gateway.pinata.cloud/ipfs/QmVcw515TyHPyCYQv2xFgEeaacA8YE2RgfuEhQJD1YUyVj/" + imageList[i],
        description: ""

    };
    let a = i+1;
    let content = JSON.stringify(obj,"","\t")
    let file = path.join(__dirname, "data/json/"+a+".json");
    fs.writeFile(file,content, function(err){
        if(err){
            return console.log(err);
        }
        console.log("nice"+a)
    })
}

// function getRandomIntInclusive(min, max) { 
//     min = Math.ceil(min); 
//     max = Math.floor(max); 
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }
