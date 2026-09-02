/* =============================================================
   PERFEITTA MODA FEMININA — comportamento
   Vanilla JS, sem dependências. Progressivo: sem JS, o site
   continua legível e os links levam ao WhatsApp geral.
   ============================================================= */
(function () {
  "use strict";

  var FONE = "5581996972127";
  var reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function wa(msg) {
    return "https://wa.me/" + FONE + "?text=" + encodeURIComponent(msg);
  }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ---------- preloader ---------- */
  function preloader() {
    var el = document.getElementById("preloader");
    if (!el) return;
    var feito = false;
    function fechar() {
      if (feito) return;
      feito = true;
      el.classList.add("pronto");
      setTimeout(function () { el.remove(); }, 700);
    }
    if (document.readyState === "complete") setTimeout(fechar, 250);
    else window.addEventListener("load", function () { setTimeout(fechar, 250); });
    setTimeout(fechar, 2200); // failsafe
  }

  /* ---------- links de WhatsApp ---------- */
  function linksWhatsApp() {
    var geral = wa("Oi, Perfeitta! Vim pelo site e queria ver as novidades disponíveis.");
    $all('[data-wa="geral"]').forEach(function (a) { a.href = geral; });

    $all("[data-wa-look]").forEach(function (a) {
      a.href = wa("Oi, Perfeitta! Vim pelo site e gostei do " + a.getAttribute("data-wa-look") +
        ". Quais tamanhos e valores?");
    });
    $all("[data-wa-reel]").forEach(function (a) {
      a.href = wa("Oi, Perfeitta! Vi o vídeo do " + a.getAttribute("data-wa-reel") +
        " no site e queria mais detalhes.");
    });
  }

  /* ---------- cabeçalho + menu ---------- */
  function cabecalho() {
    var head = $(".cabecalho");
    var botao = document.getElementById("menuBotao");
    var gaveta = document.getElementById("menuGaveta");

    function aoRolar() {
      head.classList.toggle("rolado", window.scrollY > 20);
    }
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });

    if (!botao || !gaveta) return;
    function abrir(estado) {
      var aberto = estado === undefined ? !gaveta.classList.contains("aberto") : estado;
      gaveta.classList.toggle("aberto", aberto);
      botao.setAttribute("aria-expanded", String(aberto));
      document.body.style.overflow = aberto ? "hidden" : "";
    }
    botao.addEventListener("click", function () { abrir(); });
    $all("a", gaveta).forEach(function (a) { a.addEventListener("click", function () { abrir(false); }); });
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && gaveta.classList.contains("aberto")) abrir(false);
    });
  }

  /* ---------- scroll-spy ---------- */
  function scrollSpy() {
    var links = $all('.nav a[href^="#"]');
    var alvos = links.map(function (l) { return document.querySelector(l.getAttribute("href")); }).filter(Boolean);
    if (!alvos.length) return;
    function atualiza() {
      var y = window.scrollY + 140;
      var atual = null;
      alvos.forEach(function (s) { if (s.offsetTop <= y) atual = s.id; });
      links.forEach(function (l) {
        l.classList.toggle("ativo", l.getAttribute("href") === "#" + atual);
      });
    }
    atualiza();
    window.addEventListener("scroll", atualiza, { passive: true });
  }

  /* ---------- reveal ---------- */
  function reveal() {
    var els = $all(".reveal");
    if (reduzMovimento || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("dentro"); });
      return;
    }
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("dentro"); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (el) { obs.observe(el); });

    // rede de segurança para rolagens rápidas: revela tudo que já passou pela tela
    var pendente = false;
    function varrer() {
      pendente = false;
      var limite = window.innerHeight * 1.15;
      els.forEach(function (el) {
        if (!el.classList.contains("dentro") && el.getBoundingClientRect().top < limite) {
          el.classList.add("dentro");
          obs.unobserve(el);
        }
      });
    }
    window.addEventListener("scroll", function () {
      if (!pendente) { pendente = true; requestAnimationFrame(varrer); }
    }, { passive: true });
    setTimeout(varrer, 1200);
  }

  /* ---------- lookbook: filtros ---------- */
  function lookbook() {
    var botoes = $all(".lb-filtro");
    var cards = $all(".lb-card");
    var vazio = document.getElementById("lbVazio");
    if (!botoes.length) return;

    function aplicar(filtro) {
      var visiveis = 0;
      cards.forEach(function (c) {
        var mostra = filtro === "todos" || c.getAttribute("data-cat") === filtro;
        c.hidden = !mostra;
        if (mostra) visiveis++;
      });
      if (vazio) vazio.hidden = visiveis > 0;
    }

    botoes.forEach(function (b) {
      b.addEventListener("click", function () {
        botoes.forEach(function (o) { o.classList.remove("ativo"); o.setAttribute("aria-selected", "false"); });
        b.classList.add("ativo");
        b.setAttribute("aria-selected", "true");
        aplicar(b.getAttribute("data-filtro"));
      });
    });
  }

  /* ---------- vídeo: setas + autoplay ---------- */
  function video() {
    var trilho = document.getElementById("videoTrilho");
    if (!trilho) return;
    var ant = document.getElementById("videoAnt");
    var prox = document.getElementById("videoProx");
    var passo = 280;
    if (ant) ant.addEventListener("click", function () { trilho.scrollBy({ left: -passo, behavior: "smooth" }); });
    if (prox) prox.addEventListener("click", function () { trilho.scrollBy({ left: passo, behavior: "smooth" }); });

    if (reduzMovimento || !("IntersectionObserver" in window)) return;
    var videos = $all("video", trilho);
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else v.pause();
      });
    }, { threshold: 0.6 });
    videos.forEach(function (v) { obs.observe(v); });
  }

  /* ---------- formulário de consultoria ---------- */
  function formulario() {
    var form = document.getElementById("formConsultoria");
    if (!form) return;

    var nome = $("#fNome", form);
    var zap = $("#fZap", form);
    var desc = $("#fDesc", form);
    var selecao = { tamanho: "M (40-42)", ocasiao: "Dia a dia" };

    // máscara de telefone BR
    zap.addEventListener("input", function () {
      var d = zap.value.replace(/\D/g, "").slice(0, 11);
      var out = "";
      if (d.length > 0) out = "(" + d.slice(0, 2);
      if (d.length >= 3) out += ") " + d.slice(2, 7);
      if (d.length >= 8) out += "-" + d.slice(7);
      zap.value = out;
    });

    // chips
    $all(".chip", form).forEach(function (chip) {
      chip.addEventListener("click", function () {
        var grupo = chip.getAttribute("data-grupo");
        $all('.chip[data-grupo="' + grupo + '"]', form).forEach(function (c) { c.classList.remove("ativo"); });
        chip.classList.add("ativo");
        selecao[grupo] = chip.getAttribute("data-valor");
      });
    });

    function erro(campo, mostrar) {
      var msg = $('[data-erro-de="' + campo.id + '"]', form);
      campo.setAttribute("aria-invalid", String(mostrar));
      if (msg) msg.hidden = !mostrar;
    }
    [nome, zap, desc].forEach(function (c) {
      c.addEventListener("input", function () { if (c.getAttribute("aria-invalid") === "true") erro(c, false); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var digitos = zap.value.replace(/\D/g, "");
      var ok = true;
      if (!nome.value.trim()) { erro(nome, true); ok = false; }
      if (digitos.length < 10) { erro(zap, true); ok = false; }
      if (!desc.value.trim()) { erro(desc, true); ok = false; }
      if (!ok) { var primeiro = $('[aria-invalid="true"]', form); if (primeiro) primeiro.focus(); return; }

      var msg =
        "Oi, Perfeitta! Vim pelo site para uma consultoria.\n\n" +
        "Nome: " + nome.value.trim() + "\n" +
        "WhatsApp: " + zap.value.trim() + "\n" +
        "Procuro: " + desc.value.trim() + "\n" +
        "Tamanho: " + selecao.tamanho + "\n" +
        "Ocasião: " + selecao.ocasiao;
      window.open(wa(msg), "_blank", "noopener");
    });
  }

  /* ---------- status da loja ---------- */
  function statusLoja() {
    var el = document.getElementById("lojaStatus");
    if (!el) return;
    var agora = new Date();
    var dia = agora.getDay(); // 0 dom … 6 sáb
    var h = agora.getHours() + agora.getMinutes() / 60;
    var aberto = dia >= 1 && dia <= 6 && h >= 8.5 && h < 18;
    var texto;
    if (aberto) texto = "Aberto agora · fecha às 18:00";
    else if (dia === 0) texto = "Fechado · abre segunda às 08:30";
    else if (dia === 6 && h >= 18) texto = "Fechado · abre segunda às 08:30";
    else if (h < 8.5) texto = "Fechado · abre hoje às 08:30";
    else texto = "Fechado · abre amanhã às 08:30";

    el.classList.add(aberto ? "aberto" : "fechado");
    el.innerHTML = '<span class="ponto-status" aria-hidden="true"></span><span>' + texto + "</span>";
  }

  /* ---------- copiar endereço ---------- */
  function copiarEndereco() {
    var btn = document.getElementById("copiarEndereco");
    if (!btn) return;
    var texto = "Travessa Siqueira Campos, 7 - 4º andar, Centro, Paulista - PE, 53401-030";
    var rotulo = $("span", btn);
    btn.addEventListener("click", function () {
      var feito = function () {
        rotulo.textContent = "Endereço copiado";
        setTimeout(function () { rotulo.textContent = "Copiar endereço"; }, 2200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(texto).then(feito).catch(function () { rotulo.textContent = texto; });
      } else {
        var t = document.createElement("textarea");
        t.value = texto; document.body.appendChild(t); t.select();
        try { document.execCommand("copy"); feito(); } catch (err) { rotulo.textContent = texto; }
        document.body.removeChild(t);
      }
    });
  }

  /* ---------- voltar ao topo ----------
     O cabeçalho é position: sticky, e navegar para #topo por âncora nesse
     caso rola para um ponto errado da página. Aqui rolamos direto para o
     início (o hero), de forma suave. */
  function voltarAoTopo() {
    $all('a[href="#topo"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: reduzMovimento ? "auto" : "smooth" });
        if (window.history && history.replaceState) {
          history.replaceState(null, "", location.pathname + location.search);
        }
      });
    });
  }

  /* ---------- marquee (faixa de categorias) ----------
     São dois grupos idênticos e a animação faz translateX(-50%). Para o
     loop não deixar espaço vazio, cada grupo precisa ser pelo menos tão
     largo quanto a tela — então repetimos os itens dentro de cada grupo
     até cobrir. Refaz no resize. */
  function marquee() {
    if (reduzMovimento) return;
    var trilho = document.querySelector(".marquee-trilho");
    var caixa = document.querySelector(".marquee");
    if (!trilho || !caixa) return;
    var grupos = $all(".marquee-grupo", trilho);
    if (grupos.length < 2) return;
    var base = grupos[0].innerHTML;

    function preencher() {
      grupos.forEach(function (g) { g.innerHTML = base; });
      var guarda = 0;
      while (grupos[0].getBoundingClientRect().width < caixa.clientWidth && guarda++ < 24) {
        grupos.forEach(function (g) { g.insertAdjacentHTML("beforeend", base); });
      }
    }
    preencher();

    var t;
    window.addEventListener("resize", function () {
      clearTimeout(t);
      t = setTimeout(preencher, 200);
    }, { passive: true });
  }

  /* ---------- init ---------- */
  preloader();
  document.addEventListener("DOMContentLoaded", function () {
    linksWhatsApp();
    cabecalho();
    scrollSpy();
    reveal();
    lookbook();
    video();
    formulario();
    statusLoja();
    copiarEndereco();
    voltarAoTopo();
    marquee();
    var ano = document.getElementById("ano");
    if (ano) ano.textContent = new Date().getFullYear();
  });
})();
