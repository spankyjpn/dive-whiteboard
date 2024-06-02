// ==============================================
// 背景画像の変更機能
// ==============================================
document.getElementById('backgroundSelector').addEventListener('change', function() {
    const mainCanvas = document.getElementById('mainCanvas');
    mainCanvas.style.backgroundImage = `url('${this.value}')`;
    mainCanvas.style.backgroundSize = '100%';  // 画像がコンテナの幅に合わせて拡大/縮小されるように設定
    mainCanvas.style.backgroundRepeat = 'no-repeat';  // 画像が繰り返し表示されないように設定
});

// ==============================================
// 全消去機能
// ==============================================
document.getElementById('clearAll').addEventListener('click', function() {
    document.getElementById('mainCanvas').style.backgroundImage = '';

    const elements = document.querySelectorAll('#mainCanvas img, #mainCanvas div');
    elements.forEach(el => {
        mainCanvas.removeChild(el);
    });

    if (mainCanvas.getContext) {
        const context = mainCanvas.getContext('2d');
        context.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    }
});

// ==============================================
// アイコン消去機能
// ==============================================
document.getElementById('eraseIcons').addEventListener('click', function() {
    const images = document.querySelectorAll('#mainCanvas img');
    images.forEach(img => {
        mainCanvas.removeChild(img);
    });
});

// ==============================================
// 画像のドラッグアンドドロップ機能
// ==============================================
const mainCanvas = document.getElementById('mainCanvas');
let draggedElement = null;
let offsetX, offsetY; // 要素内のクリック位置を記録する変数

mainCanvas.addEventListener('dragover', function(event) {
    event.preventDefault(); // ドロップを許可
});

mainCanvas.addEventListener('drop', function(event) {
    event.preventDefault();
    const imgUrl = event.dataTransfer.getData('text');
    const mouseX = event.clientX - mainCanvas.getBoundingClientRect().left;
    const mouseY = event.clientY - mainCanvas.getBoundingClientRect().top;

    if (!draggedElement) {
        const img = document.createElement('img');
        img.src = imgUrl;
        img.style.position = 'absolute';
        img.onload = function() {
            img.style.left = (mouseX - img.width / 2) + 'px';
            img.style.top = (mouseY - img.height / 2) + 'px';
        };
        mainCanvas.appendChild(img);

        img.addEventListener('dragstart', function(event) {
            draggedElement = img;
            offsetX = event.clientX - img.getBoundingClientRect().left;
            offsetY = event.clientY - img.getBoundingClientRect().top;
            event.dataTransfer.setData('text/plain', img.src);
        });

        img.addEventListener('dragend', function() {
            draggedElement = null;
        });
    } else {
        draggedElement.style.left = (mouseX - offsetX) + 'px';
        draggedElement.style.top = (mouseY - offsetY) + 'px';
    }
});

document.querySelectorAll('.draggable').forEach(icon => {
    icon.addEventListener('dragstart', function(event) {
        event.dataTransfer.setData('text/plain', event.target.src);
        draggedElement = null;
    });
});

// ==============================================
// 画像とテキストのドラッグ機能
// ==============================================
mainCanvas.addEventListener('mousedown', function(event) {
    if (event.target !== mainCanvas && (event.target.tagName === 'IMG' || event.target.tagName === 'DIV')) {
        draggedElement = event.target;
        offsetX = event.clientX - draggedElement.getBoundingClientRect().left;
        offsetY = event.clientY - draggedElement.getBoundingClientRect().top;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
});

function onMouseMove(event) {
    if (!draggedElement) return;
    const mouseX = event.clientX - mainCanvas.getBoundingClientRect().left;
    const mouseY = event.clientY - mainCanvas.getBoundingClientRect().top;

    draggedElement.style.left = (mouseX - offsetX) + 'px';
    draggedElement.style.top = (mouseY - offsetY) + 'px';
}

function onMouseUp() {
    draggedElement = null;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}

// ==============================================
// テキストを追加する機能
// ==============================================
document.getElementById('addText').addEventListener('click', function() {
    const text = document.getElementById('textInput').value;
    const color = 'rgb(255, 255, 0)'; // デフォルトの文字色をRGB 255, 255, 0に設定
    if (text) {
        const textElement = document.createElement('div');
        textElement.innerText = text;
        textElement.style.position = 'absolute';
        textElement.style.color = color; // テキストの色を設定
        textElement.style.fontWeight = '900'; // 太字に設定
        textElement.style.fontSize = '48px'; // フォントサイズを設定
        textElement.style.fontFamily = 'Arial Black, Meiryo, Yu Gothic, Noto Sans JP, sans-serif'; // フォントファミリーを設定
        textElement.style.zIndex = '10'; // z-indexを追加して、背景画像の上に表示
        textElement.draggable = true; // ドラッグ可能に設定

        // 要素を一旦DOMに追加してサイズを取得
        mainCanvas.appendChild(textElement);
        const textRect = textElement.getBoundingClientRect();
        const canvasRect = mainCanvas.getBoundingClientRect();

        // 画面の中央に配置
        const centerX = (canvasRect.width / 2) - (textRect.width / 2);
        const centerY = (canvasRect.height / 2) - (textRect.height / 2);
        textElement.style.left = `${centerX}px`;
        textElement.style.top = `${centerY}px`;

        textElement.addEventListener('dragstart', function(event) {
            draggedElement = textElement;
            offsetX = event.clientX - textElement.getBoundingClientRect().left;
            offsetY = event.clientY - textElement.getBoundingClientRect().top;
            event.dataTransfer.setData('text/plain', null); // 必要に応じてデータを設定
        });

        textElement.addEventListener('dragend', function(event) {
            const mouseX = event.clientX - mainCanvas.getBoundingClientRect().left;
            const mouseY = event.clientY - mainCanvas.getBoundingClientRect().top;
            textElement.style.left = (mouseX - offsetX) + 'px';
            textElement.style.top = (mouseY - offsetY) + 'px';
            draggedElement = null;
        });
    }
});
