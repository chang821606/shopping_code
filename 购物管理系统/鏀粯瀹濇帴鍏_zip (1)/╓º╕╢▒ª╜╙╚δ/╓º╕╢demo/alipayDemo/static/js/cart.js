
var data = [{
	id: 1,
	name: '1联想(Lenovo)YOGA5 PRO 标配版电脑(i5-7200u 8G 512G SSD FHD IPS)银',
	count: 1,
	sku_default_imgage_url: '../../images/cart/product_simg1.png',
	price: 4888,
	selected: true
}, {
	id: 2,
	name: '2联想(Lenovo)YOGA5 PRO 标配版电脑(i5-7200u 8G 512G SSD FHD IPS)银',
	count: 1,
	sku_default_imgage_url: '../../images/cart/product_simg1.png',
	price: 4888,
	selected: true
}, {
	id: 3,
	name: '3联想(Lenovo)YOGA5 PRO 标配版电脑(i5-7200u 8G 512G SSD FHD IPS)银',
	count: 1,
	sku_default_imgage_url: '../../images/cart/product_simg1.png',
	price: 4888,
	selected: true
}]
//显示空购物车页面
var cart = {

}
cart.data = {
	html: function () {
		//遍历数据
		var HTML = '';
		for (var i = 0; i < data.length; i++) {
			HTML += ' <div class="imfor">'
			HTML += '           <div class="check">'
			HTML += '                <div class="Each">'
			HTML += '                     <input type="checkbox" name="" value="' + data[i].id + '">'
			HTML += '                 </div>'
			HTML += '           </div>'
			HTML += '            <div class="pudc">'
			HTML += '               <div class="pudc_information" id="pudcId1">'
			HTML += '                    <img src="' + data[i].sku_default_imgage_url +
				'" class="lf" />'
			HTML += '                   <input type="hidden" name="" value="">'
			HTML += '                    <span class="des lf">'
			HTML += data[i].name
			HTML += '                       <input type="hidden" name="" value="">'
			HTML += '                   </span>'
			HTML += '                   <p class="col lf"><span>颜色：</span><span class="color_des">玫瑰金 '
			HTML += '                   <input type="hidden" name="" value=""></span></p>'
			HTML += '               </div>'
			HTML += '           </div>'
			HTML += '           <div class="pices">'
			HTML += '              <p class="pices_des">阿甲专享价</p>'
			HTML += '               <p class="pices_information"><b>￥</b><span class="pices_price">' + data[i].price +
				'</span></p>'
			HTML += '           </div>'
			HTML +=
				'           <div class="num"><span class="reduc">&nbsp;-&nbsp;</span><input class="num1207" data-id="' +
				data[i].id + '" readonly type="text"'
			HTML += '                  value="' + data[i].count +
				'" /><span class="add">&nbsp;+&nbsp;</span></div>'
			HTML += '           <div class="totle">'
			HTML +=
				'                                                                     <span>￥</span>'
			HTML += '           <span data-id="' + data[i].id + '" class="totle_information">' + data[i].count * data[i].price +
				'</span>'
			HTML += '       </div>'
			HTML += '      <div class="del">'
			HTML += ' <a href="javascript:;" data-id="' + data[i].id + '" class="del_d">删除</a>'
			HTML += ' </div>'
			HTML += '</div>'
		}
		return HTML;
	},
	sumPrice: function () {
		var _s = 0;
		$(".totle_information").each(function (i, e) {
			_s += Number($(e).text());
		})
		$(".susumOne,.susum").html(_s);
	},
	sumNum: function () {
		var _n = $(".Each input:checkbox:checked").length;
		$(".totalOne,.total").html(_n);
	},
	checkAll: function () {
		var _blnAllCheck = false;
		$(".Each input[type='checkbox']").each(function (i, e) {
			if ($(e).prop("checked")) {
				_blnAllCheck = true
			} else {
				_blnAllCheck = false;
			}
		})
		return _blnAllCheck;
	},
	delItem: function (index) {
		$(".Each input[type='checkbox']").each(function (i, e) {
			if ($(e).val() == index) {
				// var username = window.localStorage.dashop_user;
				var username = 'tarena'
				$.ajax({
					url : 'http://172.162.18.60:8888/v1/carts/'+username,
					type : "DELETE",
					dataType: "json",
					data : JSON.stringify({'sku_id':sku_id}) ,
					success : function(result) {
					    console.log(result.msg);
					}
				});
				$(".imfor").each(function (i2, e2) {
					if (i == i2) {
						$(e2).remove();
					}
				})
			}
		})
	}
}


$(function () {
	$(".imfor_top").after(cart.data.html());
	//数量增加和减少事件

	$(".reduc").each(function (i, e) {
		$(e).on("click", function () {
			//alert(i)
			var _v = $(this).next();
			var _v2 = Number(_v.val());
			if (_v2 > 1) {
				_v2--;
				_v.val(_v2);
				if ($(this).parent().parent().children('.check').children('.Each').children().prop('checked')){
					var _price = parseInt($(this).parent().prev().children('.pices_information').children('.pices_price').text());
			   var _totalprice = parseInt($(".susumOne").text());
			   _totalprice -= _price;
               $(".susumOne,.susum").text(_totalprice)
				}
			}
			var _id = _v.data("id");
			$(".totle_information").each(function (i2, e2) {
				if (_id == $(e2).data("id")) {
					var _p = data[i2].price;
					$(e2).html(_p * _v2)
				}
			})
			// var username = window.localStorage.dashop_user;
			var sku_id = $(this).parent().parent().children('.check').children('.Each').children().val()
			var username = 'tarena';
			// var sku_id = 1001
			$.ajax({
				url : 'http://172.162.18.60:8888/v1/carts/delcart/'+username,
				type : "PUT",
				dataType: "json",

				data : JSON.stringify({'sku_id':sku_id})  ,
				success : function(result) {
				console.log(result.msg);
				}
			});

		})
	})
	$(".add").each(function (i, e) {
		$(e).on("click", function () {
			//alert(i)
			var _v = $(this).prev();
			var _v2 = Number(_v.val());
			if (_v2 < 10) {
				_v2++;
				_v.val(_v2)
				if ($(this).parent().parent().children('.check').children('.Each').children().prop('checked')){
					var _price = parseInt($(this).parent().prev().children('.pices_information').children('.pices_price').text());
					var _totalprice = parseInt($(".susumOne").text());
				   _totalprice += _price;
               $(".susumOne,.susum").text(_totalprice)
				}
			}
			var _id = _v.data("id");
			$(".totle_information").each(function (i2, e2) {
				if (_id == $(e2).data("id")) {
					var _p = data[i2].price;
					$(e2).html(_p * _v2)
				}
			});



			// var username = window.localStorage.dashop_user;
			var sku_id = $(this).parent().parent().children('.check').children('.Each').children().val()
			var username = 'tarena'
			// var sku_id = 1001
			$.ajax({
				//url : 'http://127.0.0.1:8000/v1/carts/addcart/'+username,

				url : 'http://172.162.18.60:8888/v1/carts/addcart/'+username,
				type : 'PUT',
				dataType: "json",
				data : JSON.stringify({'sku_id':sku_id}) ,
				success : function(result) {
				console.log(result.msg);
				}
			});

		})
	})
	//每个单选按钮事件

	$('.Each>input').click(function () {
		if ($(this).prop('checked')) {
			var amou = parseInt($('.total').text());
			amou++;
			$('.total').text(amou);
			$('.totalOne').text(amou);
            var newamo = parseInt($('.susum').text()) + parseInt($(this).parent().parent().siblings('.totle').children('.totle_information').text());
			$('.susum').text(newamo);
			$('.susumOne').text(newamo);
		} else {
			var amou = parseInt($('.total').text());
			amou--;
			$('.total').text(amou);
			$('.totalOne').text(amou);
			var newamo = parseInt($('.susum').text()) - parseInt($(this).parent().parent().siblings('.totle').children('.totle_information').text());
			$('.susum').text(newamo);
			$('.susumOne').text(newamo);
		}
	})

	//删除事件
	$(".del_d").each(function (i, e) {
		$(this).on("click", function () {
			_index = $(this).data("id");
			$(".modal").show();
		})
	})
	$(".modal_dialog .yes").on("click", function () {
		cart.data.delItem(_index);
		$(".modal").hide();
		cart.data.sumPrice();
		if ($(".total").text() == "0") {
			$(".none").show();
		}
	})
	$(".modal_dialog .no").on("click", function () {
		$(".modal").hide();
	})
	if (!$(".imfor")) {
		$('#section').hide();
		$('.none').show();
	}


	$("#allcheck,#allcheck2").on("click", function () {
		if ($(this).prop("checked")) {
			$(".Each input[type='checkbox']").prop("checked", true);
			$("#allcheck,#allcheck2").prop("checked", true)
			cart.data.sumNum();
		    cart.data.sumPrice();
		} else {
			$(".Each input[type='checkbox']").prop("checked", false);
			$("#allcheck,#allcheck2").prop("checked", false)
			$(".susumOne,.susum").html(0);
			$(".totalOne,.total").html(0);
		}

	})
	//初始化总价
	// cart.data.sumPrice();
})
$("#go-buy").click(function () {
	var arrOutput = [];
	$(".Each input:checkbox:checked").each(function (i, e) {
		$('.num1207').each(function (i2, e2) {
			if ($(e).val() == $(e2).data("id")) {
				var _obj = {}
				_obj.id = $(e2).data("id");
				_obj.num = $(e2).val()
				arrOutput.push(_obj)
			}
		})
	})
	console.log(arrOutput)
	var token=localStorage.getItem("dashop_user")
	//发送数据
	$.ajax({
		type: 'POST',
		data: JSON.stringify({
			"data": arrOutput
		}),
		beforeSend:function(request){
            request.setRequestHeader("Authorization",token)
		},
		url: 'http://172.162.18.60:8888/v1/carts/tarena',
		dataType: "json",
		success: function (response) {
            var result = JSON.stringify(response)
            var results = JSON.parse(result)
            window.location = "http://172.162.18.60:5000/order_s"
		}
	})
})