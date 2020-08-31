var mongoose = require("mongoose");
var Taste = require("./models/taste");
var Dish = require("./models/dish");
var data = [
	{
		name: "超级文和友(太古汇店)",
		address: "天河东路78号",
		telephone: "(800)378-9861",
		rate: 4.7,
		rateNumber: 2360,
		image: "https://img.meituan.net/msmerchant/3c6af5a98511cf71ab9f02b7f9c952d82159639.jpg%40280w_212h_1e_1c_1l%7Cwatermark%3D0",
		author: {id: "5f37ca9a554a67323756a914", username: "隔壁小王"}
	}
]
var dishes = [[
	{name: "臭豆腐", price: 10, image: "https://qcloud.dpfile.com/pc/8odv8qTsrTSRdv2YgD4kLb3-mwg74NNXtWeRmked3CDZ2KqnOjFsy49EWnD8MTEBuzFvxlbkWx5uwqY2qcjixFEuLYk00OmSS1IdNpm8K8sG4JN9RIm2mTKcbLtc2o2vfCF2ubeXzk49OsGrXt_KYDCngOyCwZK-s3fqawWswzk.jpg"},
	{name: "香锅小龙虾", price: 99, image: "https://qcloud.dpfile.com/pc/0uksIU9Qo58WthcQ7hivNDHDJamE07n1V04q0DYiHVwWZs4liQl-t2_Mz8AcMe9puzFvxlbkWx5uwqY2qcjixFEuLYk00OmSS1IdNpm8K8sG4JN9RIm2mTKcbLtc2o2vfCF2ubeXzk49OsGrXt_KYDCngOyCwZK-s3fqawWswzk.jpg"}
]]
// {name: "bcew", price: 10, image: "bece"}
function seedDB(){
   //Remove all campgrounds
   Taste.remove({}, function(err){
        if(err){
            console.log(err);
        }
        var count = 0;
         //add a few campgrounds
        data.forEach(function(seed) {
            Taste.create(seed, function(err, taste){
                if(err){
                    console.log(err)
                } else {
                	dishes[count].forEach((foundDish) => {
                		console.log(foundDish);
                		Dish.create(foundDish, (err, dish) => {
                			if (err) {
                				console.log(err);
                			} else {
                				console.log("taste" + taste);
                				console.log(dish);
                				taste.dishes.push(dish);
                			}
                		})
                	})
                }
	            count++;
	            console.log(taste.dishes);
            });
        });
    });
}
module.exports = seedDB;