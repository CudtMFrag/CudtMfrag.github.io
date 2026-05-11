---
tags: []
date: 2026-05-06 20:40:40
updated: 2026-05-11 20:43:56
title: Edge 密码不加密？信自媒体不如信 AI
---

# Edge 密码不加密？信自媒体不如信 AI

> **实验**：把 Rønning 的 X 帖文原封不动丢给 ChatGPT、Claude、DeepSeek、Gemini、Grok、Kimi、豆包、元宝——网页端默认模式，不深度思考不加 prompt，就问一句「is that true？」没有一个说「密码裸奔」，没有一个喊「立即停用」。8 个模型**全部**指出了自媒体精心省略的前提：你需要先以当前用户身份拿到管理员权限才能读进程内存——而到了那一步，你的电脑已经不是你自己的了。

> 这个前提，Google 说过、KeePass 说过、1Password 说过、Bitwarden 说过、微软自己二十年前写过——六家厂商在这个问题上立场完全一致。那些只截取「by design」做标题的自媒体，究竟是在科普，还是在赚点击？

> 这篇文章，先用事实讲清楚这个事件在安全行业里到底意味着什么，再用 8 款大模型的原始回复告诉你：**哪怕最简单的 AI，都比这些标题更全面、更平衡。**

---

## 一、到底发生了什么

事情本身不复杂：

1. Edge 的密码管理器保存密码后，磁盘上是用 DPAPI 加密的。
2. 浏览器启动时，Edge 把所有已保存的凭据解密并加载到进程内存中。（Chrome 是按需加载，这点有差异，后面细说。）
3. 如果你**已经在当前用户会话中**，以当前用户身份运行一个程序去读 Edge 进程内存，就能把这些明文密码读出来。
4. Rønning 写了一个 C# 小程序（就是你在 GitHub 上看到的 `EdgeSavedPasswordsDumper`）演示这一点。
5. 他报告给 Microsoft，微软回应：**这是设计如此（by design）。**

这就是全部事实。接下来我们看看被自媒体省略掉的部分。

---

## 二、"By Design" 不是傲慢，是整个行业的共识

微软的这个回应被自媒体解读为「傲慢」「不负责任」「甩锅」。但事实上，**你的浏览器供应商、你的密码管理器作者、甚至微软自己在二十年前的安全基础理论中，都说过完全一样的话。**

### Google / Chromium 官方安全文档（逐字引用）

Chrome Security FAQ 中专门有一节标题就叫：

> **"Why aren't physically-local attacks in Chrome's threat model?"**

内容如下：

> We consider these attacks outside Chrome's threat model, because **there is no way for Chrome (or any application) to defend against a malicious user who has managed to log into your device as you, or who can run software with the privileges of your operating system user account.** Such an attacker can modify executables and DLLs, change environment variables like `PATH`, change configuration files, read any data your user account owns, email it to themselves, and so on. **Such an attacker has total control over your device, and nothing Chrome can do would provide a serious guarantee of defense. This problem is not special to Chrome — all applications must trust the physically-local user.**

🔗 [Chrome Security FAQ — Why aren&#39;t physically-local attacks in Chrome&#39;s threat model?](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/docs/security/faq.md#why-arent-physically_local-attacks-in-chromes-threat-model)

关键句翻译：「**Chrome（或任何应用程序）都无法防御一个已经以你的身份登录到你设备上的恶意用户**。这样的攻击者对你的设备有完全的控制权，Chrome 做任何事都无法提供真正的防御保障。这个困境并非 Chrome 独有——所有应用程序都必须信任物理本地的用户。」

同一份文档还特别加了一节：

> **"Why aren't compromised/infected machines in Chrome's threat model?"**
>
> Although the attacker may now be remote, the consequences are essentially the same as with physically-local attacks. The attacker's code, when it runs as your user account on your machine, can do anything you can do.

翻译：「即使攻击者是远程的（而非物理接触），后果本质上与物理本地攻击完全一样。攻击者的代码一旦以你的用户身份运行在你的机器上，就可以做你能做的任何事。」

---

### CyberArk 2022 年给 Google 报过一模一样的问题，Google 给了 WontFix

2022 年，安全公司 CyberArk 的研究员发现 Chrome 内存中也存在明文密码和 cookie，通过 `OpenProcess` + `ReadProcessMemory` 即可提取。他们向 Google 正式提交了漏洞报告。Google 的回应：

> Chromium.org stated they will not fix issues related to physical local attacks since **"there is no way for Chrome (or any application) to defend against a malicious user who has managed to log into your device as you"**.

🔗 [CyberArk — Extracting Clear-Text Credentials Directly From Chromium&#39;s Memory](https://www.cyberark.com/threat-research-blog/extracting-clear-text-credentials-directly-from-chromiums-memory/)

WontFix。不是给面子，是根本不在威胁模型内。

---

### KeePass 开发者 Dominik Reichl（逐字引用）

2023 年 KeePass 被爆出 CVE-2023-32784——可以从内存 dump 中恢复主密码。媒体同样铺天盖地「KeePass 漏洞泄露主密码」。KeePass 官方安全文档 § "Specialized Spyware" 中早有定论：

> All security features in KeePass protect against **generic** threats like keyloggers, clipboard monitors, password control monitors, etc. [...] However in all the questions above we are assuming that there is a spyware program running on the system that is specialized on attacking KeePass.
>
> **In this situation, the best security features will fail.**
>
> This is law #1 of the **Ten Immutable Laws of Security** (Microsoft TechNet):
> *"If a bad guy can persuade you to run his program on your computer, it's not your computer anymore."*

🔗 [KeePass Security — Specialized Spyware](https://keepass.info/help/base/security.html#secspecattacks)

在 SourceForge 论坛上，早在 2016 年就有人问过同样的问题，KeePass 社区的回复更直白：

> **"Click bait at most. If your computer is infected with malware, there is nothing in this world that can be secure."**

🔗 [SourceForge: Keepass is no longer secure (2016!)](https://sourceforge.net/p/keepass/discussion/329220/thread/32cc71ec/)

---

### Microsoft " 十大安全铁律 " — 被所有人引用的母本

无论是 Google 的 Chrome Security FAQ，还是 KeePass 的安全文档，共同引用的终极权威是微软自己二十年前写的 **Ten Immutable Laws of Security**：

> **Law #1: "If a bad guy can persuade you to run his program on your computer, it's not your computer anymore."**
>
> **Law #3: "If a bad guy has unrestricted physical access to your computer, it's not your computer anymore."**

🔗 [Microsoft TechNet — Ten Immutable Laws of Security](https://web.archive.org/web/20180529154650/https://technet.microsoft.com/en-us/library/hh278941.aspx)

所以当 Microsoft 对 Rønning 的报告回复 "by design" 时，他们对 Edge 的判断和他们二十年前写的安全铁律、和 Google 对 Chrome 的判断、和 KeePass 对自己的判断，是完全一致的。

---

### 1Password — 官方博客最直白的承认

1Password 的安全团队在官方博客上专门写了一篇文章回答这个问题。标题叫《How 1Password protects information on your devices (and when it can't)》。开篇第一段：

> There's one question our Security team hears more than any other: Is my 1Password data vulnerable if my device is compromised or infected with malware?
>
> **There's no password manager or other mainstream tool with the ability to guard your secrets on a fully compromised device.**
>
> The short answer is: Yes, your secrets are vulnerable to an attacker who's fully compromised your device, however unlikely that situation may be. And let me be clear that if you're an everyday internet citizen who browses securely and maintains their devices, worrying about such local threats is probably unnecessary.

🔗 [1Password — How 1Password protects information on your devices (and when it can&#39;t)](https://1password.com/blog/local-threats-device-protections)

翻译：「我们的安全团队收到最多的问题就是：如果我的设备被入侵或感染恶意软件，1Password 数据安全吗？**没有任何密码管理器或主流工具能在完全被入侵的设备上保护你的秘密。** 简短的回答是：是的，你的秘密在面对完全控制你设备的攻击者时是脆弱的。而且我要说清楚，如果你是一个正常安全浏览和维护设备的普通互联网用户，担心本地威胁大概率是不必要的。」

接着他们明确说明了 1Password 拒绝相关漏洞报告的理由：

> We have to exclude many local threats from our threat model for that reason, and often reject related bug bounty reports.
>
> At the end of the day, local threats present a number of issues we're unable to reasonably address. And that's the very reason we're forced to exclude them from our threat model and reject many related bug reports.

翻译：「正因如此，我们必须将许多本地威胁排除在我们的威胁模型之外，并且**经常拒收相关的漏洞赏金报告**。归根结底，本地威胁带来了许多我们无法合理解决的问题。这正是我们被迫将它们排除在威胁模型之外的原因。」

更早（2014 年），1Password 的安全架构师在讨论按键记录器防护时就已经说过了：

> I have said it before, and I'll say it again: 1Password and Knox cannot provide complete protection against a compromised operating system. There is a saying (for which I cannot find a source), "Once an attacker has broken into your computer [and obtained root privileges], it is no longer your computer." So in principle, **there is nothing that 1Password can do to protect you if your computer is compromised.**

🔗 [1Password — Watch what you type: 1Password&#39;s defenses against keystroke loggers](https://1password.com/blog/watch-what-you-type-1passwords-defenses-against-keystroke-loggers)

翻译：「我之前说过，再说一次：**1Password 无法在操作系统已被入侵的情况下提供完整保护。** 有句话说，' 一旦攻击者侵入了你的电脑并获得 root 权限，它就不再是你的电脑了。' 所以从原则上讲，如果你的电脑已被入侵，1Password 无法保护你。」

---

### Bitwarden — 威胁模型里写死的限制

Bitwarden 在贡献者文档中明确声明了他们的威胁模型边界。在《Memory Hardening》文档的第一句：

> **While protecting against user-space memory attacks in the general case is not within the threat model for Bitwarden applications**, the lock state must be protected, and it should not be possible to unlock a locked vault.

🔗 [Bitwarden Contributing Docs — Memory Hardening](https://contributing.bitwarden.com/architecture/deep-dives/memory-hardening)

翻译：「**在一般情况下，防御用户空间内存攻击不在 Bitwarden 应用的威胁模型之内。**」

在《A locked vault is secure》的安全原则文档中，威胁模型的定义更明确：

> Clients must ensure that highly sensitive vault data cannot be accessed in plain text once the vault has been locked, even if the device becomes compromised after the lock occurs. **Protections are not guaranteed if the device is compromised before the vault is locked.**

🔗 [Bitwarden — P02: A locked vault is secure](https://contributing.bitwarden.com/architecture/security/principles/locked-vault-is-secure)

翻译：「客户端必须确保 vault 锁定后敏感数据无法再被明文访问，即使设备在锁定后遭到入侵。**如果设备在锁定之前就已遭入侵，则保护不保证。**」

换言之：**锁定后的防御 ✓，解锁前已中招 ✗。** 和 Chrome、KeePass、1Password 完全一样的逻辑。

---

## 三、那个「Edge vs Chrome」的叙事，也是偷换概念

报道中反复强调的一个「爆点」是：

> "Edge is the only Chromium-based browser I've tested that behaves this way. By contrast, Chrome uses a design that makes it far harder for attackers to extract saved passwords."

—— Rønning 本人在 X 上的帖文，引自 [Mashable](https://mashable.com/article/microsoft-edge-password-manager-storing-credentials-plaintext)

这句话被自媒体直接简化为「Edge 漏洞，Chrome 安全」。但原文说的是 **"far harder"**，不是 **"impossible"**。而且 CyberArk 2022 年的博客已经证明了 **Chrome 同样可以被 dump**，区别仅在于：

|                           | Edge           | Chrome                         |
| ------------------------- | -------------- | ------------------------------ |
| 密码何时在内存中          | 启动时全部加载 | 使用时按需解密                 |
| dump 全部凭据的难度       | 一次搞定       | 需要触发自动填充（或伪造触发） |
| 登录后 DPAPI 解密磁盘文件 | ✅ 可以        | ✅ 可以                        |
| 离线读磁盘                | ❌ DPAPI 保护  | ❌ DPAPI 保护                  |

**差异是便利程度，不是安全与否。** 攻击者拿到你 session 之后，Chrome 只是多了一道手续，不是一道实质的防线。

SANS ISC 的研究员 Rob VandenBrink 在复现 Rønning 的发现时写道：

> I figured, it couldn't be that easy, right? But like so many things, yes, yes it was. [...] And the ironic thing? **To view these same credentials in the browser, there's a whole security theatre process where Edge wants your biometrics as proof** before disclosing even the userid and site names — you know, "for security". All the while, the whole shot is in clear text, free for the looking.

🔗 [SANS ISC — Cleartext Passwords in MS Edge? In 2026?](https://isc.sans.edu/diary/32954)

他点出了一个真实矛盾：Edge 要求 Windows Hello 验证才能查看密码，但内存里密码明文躺着。这是 UI 层的表面防护和系统层的实际威胁模型之间的脱节——但这不等于「Edge 比 Chrome 更不安全」。Chrome 同样：开发者工具里改个 `type="text"` 就能看到密码，Chrome 官方的回应？

> One of the most frequent reports we receive is password disclosure using the Inspect Element feature. [...] **The reason the password is masked is only to prevent disclosure via "shoulder-surfing" (i.e. the passive viewing of your screen by nearby persons), not because it is a secret unknown to the browser.** The browser knows the password at many layers, including JavaScript, developer tools, process memory, and so on.

🔗 [Chrome Security FAQ — What about unmasking of passwords with the developer tools?](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/docs/security/faq.md#what-about-unmasking-of-passwords-with-the-developer-tools)

翻译：「密码被掩码显示，**仅仅是为了防止旁人偷窥你的屏幕**，不是因为浏览器不知道密码。浏览器在 JavaScript、开发者工具、进程内存等各个层面都知道密码。」

---

## 四、终端服务器场景下的合理关切 vs 自媒体的过度炒作

Rønning 的核心论点其实集中在**终端服务器（Terminal Server）**场景：

> "If an attacker gains administrative access on a terminal server, they can access the memory of all logged-on user processes."

这在多用户共享的 Windows Server 上确实是一个值得关注的问题——管理员可以看到其他用户的 Edge 进程内存。一个合理的讨论应该是：**Edge 是否应该在终端服务器环境下对进程内存做额外保护？**

但自媒体的标题是「你的密码裸奔了！」「立即停用 Edge 密码管理器！」——把终端服务器场景偷换成了普通用户的单机场景。

在普通单机场景下：

- 攻击者能 dump 你的进程内存 → 已经拿到了你的用户 session 权限
- 已经拿到你 session 权限 → 可以直接装键盘记录器、hook 剪贴板、开远程桌面、读取你所有文件
- 内存 dump 只是「已经输了的游戏」中的一个收尾动作

---

## 五、自媒体的套路拆解

回顾这次报道的典型标题和对应的真相：

| 自媒体的说法                       | 真相                                                                    |
| ---------------------------------- | ----------------------------------------------------------------------- |
| 「Edge 泄露密码」                  | 需要先以你的用户身份运行程序才能读——此时你已经中招了                  |
| 「微软傲慢回应 by design」         | Google 对完全相同的问题回应 WontFix，KeePass 写了专门章节解释为什么不修 |
| 「Chrome 是安全的，Edge 才不安全」 | Chrome 同样可以被 dump，只是多一道手续；CyberArk 2022 年就演示过了      |
| 「重大安全漏洞」                   | 不是漏洞，是 Chromium 系浏览器十年以上的已知设计特性                    |
| 「立即停用」                       | 攻击者能 dump 你内存的时候，你用什么都一样                              |
| 「立即停用」                       | 攻击者能 dump 你内存的时候，你用什么都一样                              |

---

## 六、连最基础的大模型都比自媒体可信

作为一个实验，我们把 Rønning 的 X 帖文原封不动丢给了 8 个主流大模型的**网页端默认模式**——不开启深度思考、不联网搜索、不加任何 prompt 引导。问题就一句话：「is that true？」

8 个模型分别是：

| 国外    | 国内           |
| ------- | -------------- |
| ChatGPT | Kimi           |
| Claude  | 豆包 (Doubao)  |
| Gemini  | 元宝 (Yuanbao) |
| Grok    | DeepSeek       |

以下是对比结果。

### 共同点：所有模型一致确认的事实

每一个模型——无论国内外——都正确识别了以下核心事实：

1. **Edge 确实在启动时将所有密码解密到内存明文**
2. **Chrome 按需解密，攻击面更小**
3. **微软的回应是「by design」**
4. **主要风险在终端服务器/共享环境，而非个人单机**

没有一个模型说「这是假新闻」「危言耸听」或「Edge 完全安全」。也没有一个模型说「你的密码裸奔了」「立刻卸载 Edge」。

### 关键差异：自媒体漏掉的，AI 全都提到了

以下是 8 个模型在回复中**主动提及**的关键限定条件对比：

|                    | 提及「需先拿到管理员/用户权限」 | 提及「个人单机风险低」 | 提及「终端服务器才是真风险」 | 提及「Chrome 也并非免疫」 | 提及「微软威胁模型」的合理性 |
| ------------------ | ------------------------------- | ---------------------- | ---------------------------- | ------------------------- | ---------------------------- |
| **ChatGPT**  | ✅                              | ✅                     | ✅                           | —                        | —                           |
| **Claude**   | ✅                              | ✅                     | ✅                           | ✅                        | ✅                           |
| **DeepSeek** | ✅                              | ✅                     | ✅                           | ✅                        | ✅                           |
| **Gemini**   | ✅                              | ✅                     | ✅                           | —                        | ✅                           |
| **Grok**     | ✅                              | ✅                     | ✅                           | —                        | ✅                           |
| **Kimi**     | ✅                              | —                     | ✅                           | —                        | ✅                           |
| **豆包**     | ✅                              | —                     | ✅                           | —                        | —                           |
| **元宝**     | ✅                              | —                     | ✅                           | —                        | ✅                           |

关键观察：

- **100% 的模型**明确指出「攻击者必须先拿到管理权限或用户 session 权限」
- **62.5%（5/8）的模型**主动指出「个人单机用户风险很低」
- **100% 的模型**正确定位风险集中在终端服务器/企业环境
- **25%（2/8）的模型**主动指出 Chrome 也并非完全免疫（Claude、DeepSeek ）

而这些——恰恰是那些大喊「Edge 泄露密码！立即停用！傲慢回应！」的自媒体**全部省略掉**的信息。

### Claude 和 DeepSeek 的回复尤其值得读

**Claude** 专门设了「Important context/caveats」一节：

> Some security professionals note that if an attacker already has administrative access, they could potentially force Chrome to decrypt passwords too by attaching a debugger — so the practical difference may be smaller than it appears.

**DeepSeek** 在「What requires nuance (the risk assessment)」中写道：

> While technically true, if an attacker has *Administrator* rights on a machine (or terminal server), the game is effectively over. An admin can install keyloggers, dump any process memory, or simply reset passwords.

这两个模型的回复质量，已经超过了大部分科技媒体的报道。

### 国内 AI 对比

国内三个模型都正确确认了事实，但在措辞上有细微差异：

- **元宝**最接近事实陈述，基本是逐条翻译 Rønning 的帖文，不带判断
- **Kimi**偏向风险警示，引用了批评微软的安全专家言论，但立场仍属合理
- **豆包**最直接——「Edge is less secure than Chrome against local admin memory scraping attacks」，但同时也正确指出了风险场景和缓解建议

三个国内 AI 的结论都比「你的密码裸奔了」自媒体标题要克制和准确得多。

**你不需要任何安全背景，不需要懂 C#，不需要读 Chromium 源码——你只需要打开任何一个大模型网页版，用默认模式问一句「is that true？」，就能得到比那些「大新闻」自媒体更全面、更平衡、更诚实的回答。**

那些自媒体不是不知道这些限定条件——他们在「终端服务器」「需先拿到管理员权限」「个人用户风险极低」这些关键信息面前，**选择了闭嘴**。因为加了这些，标题就不够吓人了。

---

## 七、你应该真正担心什么

这篇文章不是为 Edge 或微软洗地。Edge 一次性加载全部密码到内存确实是一个可以改进的设计——其他浏览器按需解密在纵深防御意义上更好，值得微软认真对待（尤其是在终端服务器场景下）。

但自媒体的叙事把「纵深防御可改进」偷换成了「Edge 不安全、Chrome 安全」，这不仅是错的，而且是有害的——它让普通用户误以为换个浏览器就安全了。

**真正要关注的是**：

1. 不要让不可信的程序以你的用户身份运行——这是唯一的真实防线
2. 如果你在终端服务器/共享电脑上使用密码管理器，知道管理员能看到你的进程内存
3. 需要更高安全保障的场景，不要依赖浏览器的内置密码管理器——用独立的密码管理器，且用完锁定
4. 如果你想换浏览器，那是你的自由，但不要因为一篇自媒体的标题做决定

---

## 附：全文引用来源速查

| 来源                                     | 角色                 | 链接                                                                                                                                                                                                                                                                                                                                                   |
| ---------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Chromium Security FAQ                    | Google 官方安全文档  | [链接](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/docs/security/faq.md)                                                                                                                                                                                                                                                             |
| CyberArk 2022 Chrome 内存密码研究        | 独立安全公司         | [链接](https://www.cyberark.com/threat-research-blog/extracting-clear-text-credentials-directly-from-chromiums-memory/)                                                                                                                                                                                                                                   |
| KeePass Security — Specialized Spyware  | KeePass 官方文档     | [链接](https://keepass.info/help/base/security.html#secspecattacks)                                                                                                                                                                                                                                                                                       |
| KeePass 论坛 (2016)                      | KeePass 社区         | [链接](https://sourceforge.net/p/keepass/discussion/329220/thread/32cc71ec/)                                                                                                                                                                                                                                                                              |
| 1Password 官方博客 (2024)                | 1Password 安全团队   | [链接](https://1password.com/blog/local-threats-device-protections)                                                                                                                                                                                                                                                                                       |
| 1Password 官方博客 (2014)                | 1Password 安全架构师 | [链接](https://1password.com/blog/watch-what-you-type-1passwords-defenses-against-keystroke-loggers)                                                                                                                                                                                                                                                      |
| Bitwarden Memory Hardening               | Bitwarden 贡献者文档 | [链接](https://contributing.bitwarden.com/architecture/deep-dives/memory-hardening)                                                                                                                                                                                                                                                                       |
| Bitwarden 威胁模型定义                   | Bitwarden 贡献者文档 | [链接](https://contributing.bitwarden.com/architecture/security/principles/locked-vault-is-secure)                                                                                                                                                                                                                                                        |
| Microsoft Ten Immutable Laws of Security | 微软安全基础理论     | [链接](https://web.archive.org/web/20180529154650/https://technet.microsoft.com/en-us/library/hh278941.aspx)                                                                                                                                                                                                                                              |
| Microsoft Edge "by design" 回应          | 多家媒体一致报道     | [Computerworld](https://www.computerworld.com/article/4167430/edge-browser-leaves-passwords-exposed-in-plain-text-says-researcher.html) · [Heise](https://www.heise.de/en/news/Microsoft-Edge-Passwords-end-up-in-memory-as-plaintext-11281576.html) · [Mashable](https://mashable.com/article/microsoft-edge-password-manager-storing-credentials-plaintext) |
| SANS ISC 日記                            | 安全从业者复现       | [链接](https://isc.sans.edu/diary/32954)                                                                                                                                                                                                                                                                                                                  |
| EdgeSavedPasswordsDumper                 | Rønning 的 PoC      | [链接](https://github.com/L1v1ng0ffTh3L4N/EdgeSavedPasswordsDumper)                                                                                                                                                                                                                                                                                       |
| 八款大模型横向对比                       | 作者实测             | [OneDrive](https://1drv.ms/f/c/107d48e0e5510d64/IgBaUfXF-vc0RoMveKQFsL54AV70RhMyJTIKnPmdNPE7nf0?e=2L40cf)                                                                                                                                                                                                                                                 |
