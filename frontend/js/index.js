const calcTime = (timestamp) => {
  // new Date().getTime()은 항상 UTC 기준이므로, 별도 시간 보정이 불필요합니다.
  const diff = new Date().getTime() - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}일 전`;
  if (hours > 0) return `${hours}시간 전`;
  if (minutes > 0) return `${minutes}분 전`;
  if (seconds > 0) return `${seconds}초 전`;
  return "방금 전";
};

const renderData = async (data) => {
  const main = document.querySelector("main");
  // DocumentFragment를 사용해 DOM 조작 성능을 최적화합니다.
  const fragment = document.createDocumentFragment();

  // forEach + async는 순서를 보장하지 않으므로 for...of를 사용합니다.
  for (const obj of data.slice().reverse()) {
    const div = document.createElement("div");
    div.className = "item-list";

    const imgDiv = document.createElement("div");
    imgDiv.className = "item-list__img";

    const img = document.createElement("img");
    try {
      const res = await fetch(`/images/${obj.id}`);
      const blob = await res.blob();
      img.src = URL.createObjectURL(blob);
    } catch (e) {
      console.error(`이미지 로딩 실패 (id: ${obj.id}):`, e);
      img.alt = "이미지 로딩 실패";
    }

    const info = document.createElement("div");
    info.className = "item-list__info";

    const title = document.createElement("div");
    title.className = "item-list__info-title";
    title.textContent = obj.title;

    const meta = document.createElement("div");
    meta.className = "item-list__info-meta";
    // 템플릿 리터럴로 가독성을 높입니다.
    meta.textContent = `${obj.place} · ${calcTime(obj.insertAt)}`;

    const price = document.createElement("div");
    price.className = "item-list__info-price";
    // toLocaleString()으로 가격에 쉼표를 추가합니다.
    price.textContent = `${Number(obj.price).toLocaleString()}원`;

    imgDiv.appendChild(img);

    info.appendChild(title);
    info.appendChild(meta);
    info.appendChild(price);
    div.appendChild(imgDiv);
    div.appendChild(info);
    fragment.appendChild(div);
  }
  main.appendChild(fragment);
};

const fetchList = async () => {
  const access_token = window.localStorage.getItem("token");
  if (access_token) {
    const res = await fetch("/items", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    if (res.status === 401) {
      alert("로그인이 필요합니다.");
      window.location.pathname = "/login.html";
      return;
    }
    const data = await res.json();
    renderData(data);
  }
};

fetchList();
