import { CheckProxy } from '@wailsjs/go/utils/Proxy'

export default function Index() {
  const [proxy, setProxy] = createSignal('')
  const [proxyStatus, setProxyStatus] = createSignal(false)
  const [isCheck, setIsCheck] = createSignal(false)
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
        class="px-4 py-2 w-250px text-center bg-transparent outline-none outline-active:none border border-rounded border-gray-200 border-dark:gray-700"
        onInput={e => setProxy(e.currentTarget.value) && setIsCheck(false)}
        onKeyDown={({ key }) => key === 'Enter' && checkProxy()}
        autocomplete="off"
      />
      <div class="gap-4 flex justify-center text-xl w-100 mx-auto my-4 rounded shadow">
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
    </div>
  )
}
