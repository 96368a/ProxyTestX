export default function Footer() {
  const { isDark, toggleDark } = useDark()
  return (
    <nav class="mt-6 inline-flex gap-2 text-xl">
      <button class="icon-btn !outline-none" onClick={() => toggleDark()}>
        {isDark() ? <div class="i-carbon-moon" /> : <div class="i-carbon-sun" />}
      </button>

      <a
        class="i-carbon-logo-github icon-btn"
        rel="noreferrer"
        href="https://github.com/96368a/ProxyTestX"
        target="_blank"
        title="GitHub"
      />
    </nav>

  )
}
