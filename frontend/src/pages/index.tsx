import { CheckProxy } from '@wailsjs/go/utils/Proxy'
import Url from 'url-parse'

export default function Index() {
  const [proxy, setProxy] = createStore({
    host: 'example.com',
    port: '8080',
    protocol: 'http:',
  })
  const [proxyList, setProxyList] = createStore([
    {
      host: 'example.com',
      port: '8080',
      protocol: 'http:',
      time: 9999.99,
      check: false,
      status: false,
      log: '',
    },
  ])
  onMount(() => {
    if (localStorage.getItem('proxy')) {
      const proxy = JSON.parse(localStorage.getItem('proxy') as string)
      setProxy(proxy)
    }
    if (localStorage.getItem('proxyList')) {
      const proxyList = JSON.parse(localStorage.getItem('proxyList') as string)
      setProxyList(proxyList)
    }
  })
  const [isFormat, setIsFormat] = createSignal(true)
  const [pattern, setPattern] = createSignal(true)
  const [spin, setSpin] = createSignal(false)
  const [checking, setChecking] = createSignal(false)

  // 判断当前输入的代理格式是否正确
  const formatProxy = (value: string) => {
    if (value === '' || value.match(/^(http|https|socks5):\/\/\w+(\.\w+)*(:[0-9]+)?$/)) {
      setIsFormat(true)
      const proxyUrl = new Url(value)
      setProxy('host', proxyUrl.hostname)
      setProxy('port', proxyUrl.port)
      setProxy('protocol', proxyUrl.protocol)
    }
    else { setIsFormat(false) }
  }

  // 检查代理方法
  const checkProxy = async () => {
    // 判断当前是否正在检测
    if (checking())
      return

    localStorage.setItem('proxy', JSON.stringify(proxy))
    setChecking(true)
    setProxyList(0, proxy)
    setProxyList(0, 'check', false)
    setProxyList(0, 'status', false)
    setProxyList(0, 'log', '检测中...')
    localStorage.setItem('proxyList', JSON.stringify(proxyList))

    const res = await CheckProxy(`${proxyList[0].protocol}//${proxyList[0].host}:${proxyList[0].port}`)

    setChecking(false)
    setProxyList(0, 'check', true)
    setProxyList(0, 'status', res.status)
    setProxyList(0, 'time', res.time)
    setProxyList(0, 'log', res.info)
  }
  const changePattern = () => {
    setSpin(true)
    setTimeout(() => {
      setPattern(!pattern())
    }, 100)
    setTimeout(() => {
      setSpin(false)
    }, 500)
  }
  return (
    <div>
      <div class="my-4">
        <div class='flex items-center justify-center gap-4'>
          <div class='h-10 min-w-120 flex items-center'>
            <Show when={pattern()} fallback={
              <input
                placeholder="input your proxy"
                type="text"
                value={`${proxy.protocol}//${proxy.host}:${proxy.port}`}
                class="outline-active:none min-w-60 w-full border border-dark:gray-700 border-gray-200 border-rounded bg-transparent px-4 py-2 text-center outline-none"
                onInput={e => formatProxy(e.currentTarget.value)}
                onKeyDown={({ key }) => key === 'Enter' && checkProxy()}
                autocomplete="off"
              />}>
              <div class='flex items-center gap-1'>
                <div class="relative mx-4 h-10">
                  <select value={proxy.protocol.replace(':', '')}
                  onchange={e => setProxy('protocol', `${e.currentTarget.value}:`)}
                  class="h-full w-30 border border-blue-gray-200 rounded-2 px-3 py-2.5 text-center text-sm text-blue-gray-700 outline-0 outline transition-all disabled:border-0 focus:border-2 placeholder-shown:border focus:border-pink-500 placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:outline-0 empty:!bg-red-500">
                    <option class="text-left">http</option>
                    <option class="text-left">socks5</option>
                  </select>
                </div>
                <input
                placeholder="address"
                type="text"
                value={proxy.host}
                class="outline-active:none min-w-60 w-full border border-dark:gray-700 border-gray-200 border-rounded bg-transparent px-4 py-2 text-center outline-none"
                onInput={e => setProxy('host', e.currentTarget.value)}
                onKeyDown={({ key }) => key === 'Enter' && checkProxy()}
                autocomplete="off"
                />
                :
                <input
                placeholder="port"
                type="text"
                value={proxy.port}
                class="outline-active:none min-w-20 border border-dark:gray-700 border-gray-200 border-rounded bg-transparent px-4 py-2 text-center outline-none"
                onInput={e => setProxy('port', e.currentTarget.value)}
                onKeyDown={({ key }) => key === 'Enter' && checkProxy()}
                autocomplete="off"
                />
              </div>
            </Show>
          </div>
          <div onclick={changePattern} class="cursor-pointer" classList={{
            'animate-[spin_500ms_ease-in-out]': spin(),
          }}>
            <div class="i-carbon-partition-auto text-xs" />
          </div>
        </div>
        <div class='h-6'>
          <Show when={!isFormat()}>
            <span class='text-red-500'>请输入正确的代理格式</span>
          </Show>
        </div>
        <div class='mb-8'>
          <button class='btn' onclick={checkProxy} disabled={checking()}>
            <Show when={checking()}>
            <div class="i-mdi-loading mx-2 inline-block animate-spin vertical-text-bottom"></div>
            </Show>
            检查代理
            </button>
        </div>
      </div>
      <div class="flex flex-col rounded shadow dark:bg-gray-700 dark:shadow-gray-900">
        <div class="overflow-x-auto lg:-mx-8 sm:-mx-6">
          <div class="min-w-full lg:px-8 sm:px-6">
            <div class="overflow-hidden">
              <table class="w-full table-fixed text-left text-sm font-light">
                <thead class="border-b font-medium dark:border-neutral-500">
                  <tr>
                    <th scope="col" class="min-w-60 w-100 px-6 py-4">代理地址</th>
                    <th scope="col" class="w-40 px-6 py-4">延迟</th>
                    <th scope="col" class="w-60 px-6 py-4">状态</th>
                    <th scope="col" class="px-6 py-4">测试日志</th>
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
                        <td class="w-100 overflow-hidden text-ellipsis whitespace-nowrap px-6 py-4 font-medium">{`${item.protocol}//${item.host}:${item.port}`}</td>
                        <td class="w-40 whitespace-nowrap px-6 py-4">{item.time}ms</td>
                        <td class="w-60 whitespace-nowrap px-6 py-4">
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
