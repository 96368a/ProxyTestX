package utils

import (
	"context"
	"errors"
	"net/http"
	"net/url"
	"time"
)

type Proxy struct {
	ctx context.Context
}

func (*Proxy) CheckProxy(proxyStr string) (bool, error) {
	//格式化代理地址
	proxyURL, err := url.Parse(proxyStr)
	//错误的格式
	if err != nil {
		return false, errors.New("invalid proxy URL")
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
			return false, errors.New("invalid proxy protocol")
		}
	}
	client := &http.Client{
		Transport: &http.Transport{
			Proxy: http.ProxyURL(proxyURL),
		},
		Timeout: 5 * time.Second, // 设置超时时间
	}

	// 发送一个请求检测代理是否可用
	resp, err := client.Get("https://www.baidu.com")
	if err != nil {
		return false, errors.New("error connecting to the proxy")
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusOK {
		return true, nil
	}

	return false, errors.New("unknown error")
}
