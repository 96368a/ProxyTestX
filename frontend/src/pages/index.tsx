import { CheckProxy } from '@wailsjs/go/utils/Proxy'

export default function Index() {
  const [proxy, setProxy] = createSignal('')
  const [proxyStatus, setProxyStatus] = createSignal(false)
  const [isCheck, setIsCheck] = createSignal(false)
  const proxylist = [
    {
      proxy: 'http://127.0.0.1:7890',
      time: 0,
      check: false,
      status: false,
      log: 'test',
    },
    {
      proxy: 'http://127.0.0.1:190',
      time: 0,
      check: false,
      status: false,
      log: 'test',
    },
  ]
  const checkProxy = () => {
    CheckProxy(proxy()).then((res) => {
      setIsCheck(true)
      setProxyStatus(res)
    }).catch((err) => {
      setIsCheck(true)
      setProxyStatus(false)
      throw err
    })
  }
  return (
    <div>
      <input
        id="input"
        placeholder="input your proxy"
        type="text"
        value={proxy()}
        class="outline-active:none w-250px border border-dark:gray-700 border-gray-200 border-rounded bg-transparent px-4 py-2 text-center outline-none"
        onInput={e => setProxy(e.currentTarget.value) && setIsCheck(false)}
        onKeyDown={({ key }) => key === 'Enter' && checkProxy()}
        autocomplete="off"
      />
      <div class="mx-auto my-4 w-100 flex justify-center gap-4 rounded text-xl shadow">
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
      </div>
      <div class="flex flex-col rounded shadow dark:bg-gray-700 dark:shadow-gray-900">
        <div class="overflow-x-auto lg:-mx-8 sm:-mx-6">
          <div class="min-w-full lg:px-8 sm:px-6">
            <div class="overflow-hidden">
              <table class="min-w-full text-left text-sm font-light">
                <thead class="border-b font-medium dark:border-neutral-500">
                  <tr>
                    <th scope="col" class="px-6 py-4">代理地址</th>
                    <th scope="col" class="px-6 py-4">延迟</th>
                    <th scope="col" class="px-6 py-4">状态</th>
                    <th scope="col" class="px-6 py-4">测试日志</th>
                  </tr>
                </thead>
                <tbody>
                  <For each={proxylist}>
                    {(item, i) => (
                      <tr class="dark:border-neutral-500" classList={
                        {
                          'border-b': i() !== proxylist.length - 1,
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
                              <div class="i-carbon-error" bg-red />
                            }>
                              <div class="i-carbon-checkmark-outline bg-green" />
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
