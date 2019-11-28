from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.views import View
from alipay import AliPay
import os
from django import http
# Create your views here.
# 本demo未配置数据库故订单id等使用常量表示
ORDER_ID = "2019111821315601" # 订单编号
TOTAL_AMOUNT = 159            # 订单金额
IP_URL = "127.0.0.1"          # 商户ip地址
ORDER_STATUS = 0              # 订单状态

# 处理跳转支付宝业务
class OrderProcessingnView(View):
    # 获取跳转支付页面
    def get(self,request):
        return render(request,'ajax_alipay.html')
    # 确认支付获取支付宝支付URL
    def post(self,reuqest):
        alipay = AliPay(
            appid="2016100200644279",
            app_notify_url=None,  # 默认回调url-　阿里与商户后台交互
            # 使用的文件读取方式,载入支付秘钥
            app_private_key_path=os.path.join(os.getcwd(), "utils/key_file/s7_private_key.pem"),
            # 支付宝的公钥，验证支付宝回传消息使用，不是你自己的公钥,
            # 使用文件读取的方式,载入支付报公钥
            alipay_public_key_path=os.path.join(os.getcwd(), "utils/key_file/alipay_public_key.pem"),
            sign_type="RSA2",  # RSA 或者 RSA2
            debug=True  # 默认False
        )
        # 电脑网站支付，需要跳转到https://openapi.alipaydev.com/gateway.do? + order_string
        # 测试方式此为支付宝沙箱环境
        order_string = alipay.api_alipay_trade_page_pay(
            out_trade_no=ORDER_ID,
            total_amount=TOTAL_AMOUNT,
            subject=ORDER_ID,
            # 回转url,　支付宝与买家业务处理完毕(支付成功)将玩家重定向到此路由,带着交易的参数返回
            return_url="http://" + IP_URL + ":8000/payment/result/",
            notify_url="http://" + IP_URL + ":8000/payment/result/"  # 可选, 不填则使用默认notify url
        )
        pay_url = "https://openapi.alipaydev.com/gateway.do?" + order_string
        return http.JsonResponse({"status":1,"pay_url":pay_url})
# 处理支付宝回调及重定向业务
class PaymentResultView(View):
    # 获取参数字典和验签结果
    def get_sdict_ali_verify(self, request, method):
        """
        :param request:
        :param method: 请求方式
        :return: success_dict,ali_verufy,alipay
        """
        success_dict = {}
        if method == 1:
            for key, val in request.GET.items():
                success_dict[key] = val
        if method == 2:
            for key, val in request.POST.items():
                success_dict[key] = val
        # 1.剔除掉sign做验签准备
        sign = success_dict.pop("sign", None)
        # 2.生成alipay对象
        alipay = AliPay(
            appid="2016100200644279",
            app_notify_url="http://" + IP_URL + ":8000/payment/result",
            app_private_key_path=os.path.join(os.getcwd(), "utils/key_file/s7_private_key.pem"),
            alipay_public_key_path=os.path.join(os.getcwd(), "utils/key_file/alipay_public_key.pem"),
            debug=True
        )
        # 3.使用支付宝接口进行验签
        ali_verify = alipay.verify(success_dict, sign)
        return success_dict, ali_verify, alipay

    # 重定向接口
    def get(self, request):
        # 1.获取参数字典,验签结果,alipay对象
        success_dict, ali_verify, alipay = self.get_sdict_ali_verify(request, 1)
        # 2.根据验证结果进行业务处理
        if ali_verify is True:
            order_id = success_dict.get('out_trade_no', None)
            if ORDER_STATUS == 2:
                return HttpResponse("订单支付成功")
            # 主动查询
            else:
                result = alipay.api_alipay_trade_query(out_trade_no=order_id) #  主动查询接口
                if result.get("trade_status", "") == "TRADE_SUCCESS":
                    return HttpResponse("主动查询结果订单支付完成了")
                else:
                    return HttpResponse("支付未完成")
        else:
            return HttpResponse("非法访问")

    # 回调接口
    def post(self, request):
        """
        处理支付宝的付款回调业务
        :param request:
        :return:
        """
        # 1.获取参数字典,验签结果,alipay对象
        success_dict, ali_verify, alipay = self.get_sdict_ali_verify(request, 2)
        # 2.根据验证结果进行业务处理
        if ali_verify is True:
            trade_status = success_dict.get('trade_status', None)
            if trade_status == "TRADE_SUCCESS":
                ORDER_STATUS = 2
                return HttpResponse("seccess")
        else:
            return HttpResponse("非法访问")
