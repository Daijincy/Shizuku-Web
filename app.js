// Shizuku-Web —— 1:1 复刻整活脚本：所有功能都能点，但啥也不干
(function () {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  let running = false;
  let snackTimer = null;

  // ---------- Snackbar ----------
  function toast(msg) {
    const bar = $("#snackbar");
    bar.textContent = msg;
    bar.classList.remove("hidden");
    clearTimeout(snackTimer);
    snackTimer = setTimeout(() => bar.classList.add("hidden"), 2200);
  }

  // ---------- 抽屉 ----------
  const drawer = $("#drawer");
  const scrim = $("#scrim");
  function openDrawer() { drawer.classList.add("open"); scrim.classList.remove("hidden"); requestAnimationFrame(()=>scrim.classList.add("show")); }
  function closeDrawer() { drawer.classList.remove("open"); scrim.classList.remove("show"); setTimeout(()=>scrim.classList.add("hidden"), 200); }
  $("#btnMenu").addEventListener("click", openDrawer);
  scrim.addEventListener("click", closeDrawer);

  // ---------- 页面切换 ----------
  function goPage(name) {
    $$(".page").forEach((p) => p.classList.remove("active"));
    $("#page-" + name).classList.add("active");
    $$(".nav-item").forEach((n) => n.classList.toggle("active", n.dataset.page === name));
    closeDrawer();
    closeOverflow();
    $("#content").scrollTop = 0;
  }
  $$("[data-page]").forEach((el) => el.addEventListener("click", () => goPage(el.dataset.page)));

  // ---------- 溢出菜单 ----------
  const menu = $("#overflowMenu");
  function closeOverflow() { menu.classList.add("hidden"); }
  $("#btnOverflow").addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("hidden");
  });
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target)) closeOverflow();
  });

  // ---------- 通用 toast 绑定 ----------
  $$("[data-toast]").forEach((el) =>
    el.addEventListener("click", () => toast(el.dataset.toast))
  );

  // ---------- 可展开 ----------
  $$("[data-expand]").forEach((head) =>
    head.addEventListener("click", () => head.parentElement.classList.toggle("open"))
  );

  // ---------- 假开关 ----------
  $$("[data-fakeswitch]").forEach((sw) =>
    sw.addEventListener("change", () =>
      toast(sw.checked ? "已开启（其实啥也没开）" : "已关闭（其实啥也没关）")
    )
  );

  // ---------- 状态切换 ----------
  function setRunning(on) {
    running = on;
    $("#statusStopped").classList.toggle("hidden", on);
    $("#statusRunning").classList.toggle("hidden", !on);
    $("#statusMeta").classList.toggle("hidden", !on);
    $("#appsCard").classList.toggle("hidden", !on);
  }

  function fakeStart() {
    const ov = $("#startOverlay");
    ov.classList.remove("hidden");
    setTimeout(() => {
      ov.classList.add("hidden");
      setRunning(true);
      goPage("home");
      toast("Shizuku 正在运行（并没有）");
    }, 2200);
  }
  $$("[data-start]").forEach((b) => b.addEventListener("click", fakeStart));

  $("#btnStop").addEventListener("click", () => {
    setRunning(false);
    goPage("home");
    toast("Shizuku 服务已停止（本来就没运行过）");
  });

  // ---------- 配对流程（假） ----------
  $("#btnPair").addEventListener("click", () => {
    const ov = $("#pairOverlay");
    ov.classList.remove("hidden");
    setTimeout(() => {
      ov.classList.add("hidden");
      openPairDialog();
    }, 1800);
  });

  const pairDialog = $("#pairDialog");
  function openPairDialog() {
    pairDialog.classList.remove("hidden");
    const inputs = $$("#codeInputs input");
    inputs.forEach((i) => (i.value = ""));
    inputs[0].focus();
    inputs.forEach((inp, idx) =>
      inp.addEventListener("input", () => {
        if (inp.value && idx < inputs.length - 1) inputs[idx + 1].focus();
      })
    );
  }
  $("#pairCancel").addEventListener("click", () => pairDialog.classList.add("hidden"));
  $("#pairOk").addEventListener("click", () => {
    pairDialog.classList.add("hidden");
    toast("配对成功（假的，启动不了一点）");
  });
})();
