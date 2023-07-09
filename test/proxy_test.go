package test

import (
	"changeme/utils"
	"fmt"
	"testing"
)

func TestProxy(t *testing.T) {
	proxyStr := "socks5://127.0.0.1:7890" // 代理字符串
	proxy := &utils.Proxy{}
	isProxyAvailable, _ := proxy.CheckProxy(proxyStr)
	fmt.Println("Is proxy available:", isProxyAvailable)
	if !isProxyAvailable {
		t.Fail()
	}
}
