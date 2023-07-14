import { CheckProxy } from '@wailsjs/go/utils/Proxy'

export default function Index() {
  const [proxy, setProxy] = createSignal('')
  const [isFormat, setIsFormat] = createSignal(true)
  const [proxyList, setProxyList] = createStore([
    {
      proxy: 'http://example.com:8080',
      time: 0,
      check: false,
      status: false,
      log: '',
    },
  ])
  const formatProxy = (value: string) => {
    if (value === '' || value.match(/^(http|https|socks5):\/\/\w+(\.\w+)*(:[0-9]+)?$/)) {
      setIsFormat(true)
      setProxy(value)
    }
    else { setIsFormat(false) }
  }
  const checkProxy = () => {
    // CheckProxy(proxy()).then((res) => {
    //   setIsCheck(true)
    //   setProxyStatus(res)
    // }).catch((err) => {
    //   setIsCheck(true)
    //   setProxyStatus(false)
    //   throw err
    // })
    // 检查代理是否改变
    if (proxy() !== proxyList[0].proxy) {
      setProxyList(0, 'proxy', proxy())
      setProxyList(0, 'check', false)
      setProxyList(0, 'status', false)
      setProxyList(0, 'log', '检测中...')
    }
    // 检查是否已经检查过
    if (proxyList[0].check)
      return
    // 检查代理
    CheckProxy(proxyList[0].proxy).then((res) => {
      setProxyList(0, 'check', true)
      setProxyList(0, 'status', res)
      setProxyList(0, 'log', '检测成功')
    }).catch((err) => {
      setProxyList(0, 'check', true)
      setProxyList(0, 'status', false)
      setProxyList(0, 'log', err)
      throw err
    })
  }
  return (
    <div >
      <div class="my-4">
        <div>
          <input
            id="input"
            placeholder="input your proxy"
            type="text"
            value={proxy()}
            class="outline-active:none my-2 w-250px border border-dark:gray-700 border-gray-200 border-rounded bg-transparent px-4 py-2 text-center outline-none"
            onInput={e => formatProxy(e.currentTarget.value)}
            onKeyDown={({ key }) => key === 'Enter' && checkProxy()}
            autocomplete="off"
          />
        </div>
        <div class='h-20'>
        <Show when={!isFormat()}>
          <span class='text-red-500'>请输入正确的代理格式</span>
        </Show>
        </div>
      </div>
      {/* <div class="mx-auto my-4 w-100 flex justify-center gap-4 rounded text-xl shadow">
        <div w-80>{proxy()}</div>
        <Show when={isCheck()}
          fallback={<div class="i-carbon-warning-square" />}
        >
          <Show when={proxyStatus()} fallback={
            <div class="i-carbon-error" bg-red />
          }>
            <div class="i-carbon-checkmark-outline bg-green" />
          </Show>
        </Show>
      </div> */}
      <div class="flex flex-col rounded shadow dark:bg-gray-700 dark:shadow-gray-900">
        <div class="overflow-x-auto lg:-mx-8 sm:-mx-6">
          <div class="min-w-full lg:px-8 sm:px-6">
            <div class="overflow-hidden">
              <table class="min-w-full table-auto text-left text-sm font-light">
                <thead class="border-b font-medium dark:border-neutral-500">
                  <tr>
                    <th scope="col" class="min-w-60 w-60 px-6 py-4">代理地址</th>
                    <th scope="col" class="w-40 px-6 py-4">延迟</th>
                    <th scope="col" class="w-40 px-6 py-4">状态</th>
                    <th scope="col" class="w-40 px-6 py-4">测试日志</th>
                  </tr>
                </thead>
                <tbody>
                  <For each={proxyList}>
                    {(item, i) => (
                      <tr class="dark:border-neutral-500" classList={
                        {
                          'border-b': i() !== proxyList.length - 1,
                        }
                      }>
                        <td class="whitespace-nowrap px-6 py-4 font-medium">{item.proxy}</td>
                        <td class="whitespace-nowrap px-6 py-4">{item.time}ms</td>
                        <td class="whitespace-nowrap px-6 py-4">
                          <Show when={item.check}
                            fallback={
                              <div class="flex items-center gap-1">
                                <div class="i-carbon-warning-square" />
                                未检测
                              </div>
                            }
                          >
                            <Show when={item.status} fallback={
                              <div class="flex items-center gap-1">
                                <div class="i-carbon-error" bg-red />
                                不可用
                              </div>
                            }>
                              <div class="flex items-center gap-1">
                                <div class="i-carbon-checkmark-outline bg-green" />
                                连接可用
                              </div>
                            </Show>
                          </Show>
                        </td>
                        <td class="whitespace-nowrap px-6 py-4">{item.log}</td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
