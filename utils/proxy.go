package utils

import (
	"context"
	"math"
	"net/http"
	"net/url"
	"time"
)

type Proxy struct {
	ctx context.Context
}

type ProxyInfo struct {
	Proxy  string  `json:"proxy"`
	Status bool    `json:"status"`
	Time   float64 `json:"time"`
	Info   string  `json:"info"`
}

func (*Proxy) CheckProxy(proxyStr string) ProxyInfo {
	//格式化代理地址
	proxyURL, err := url.Parse(proxyStr)
	proxyInfo := ProxyInfo{
		Proxy:  proxyStr,
		Status: false,
		Time:   9999.99,
		Info:   "",
	}
	//错误的格式
	if err != nil {
		proxyInfo.Info = "错误的代理格式"
		return proxyInfo
	}
	//支持的协议
	protocols := []string{
		"http",
		"socks5",
	}
	//判断协议是否正确
	for i, protocol := range protocols {
		if proxyURL.Scheme == protocol {
			break
		}
		if i == len(protocols)-1 {
			proxyInfo.Info = "不支持的代理协议"
			return proxyInfo
		}
	}
	client := &http.Client{
		Transport: &http.Transport{
			Proxy: http.ProxyURL(proxyURL),
		},
		Timeout: 5 * time.Second, // 设置超时时间
	}
	// 记录开始请求时间
	start := time.Now()
	// 发送一个请求检测代理是否可用
	resp, err := client.Get("https://www.baidu.com")
	if err != nil {
		proxyInfo.Info = "连接代理超时"
		return proxyInfo
	}
	defer resp.Body.Close()

	proxyInfo.Status = true
	// 计算延迟时间，保留两位小数
	proxyInfo.Time = math.Round(float64(time.Since(start))/10e6*100) / 100
	proxyInfo.Info = "代理测试通过"
	if resp.StatusCode == http.StatusOK {
		return proxyInfo
	}

	return proxyInfo
}
