function findBestUC() {
    let targetUC = parseInt(document.getElementById("ucInput").value);
    if (isNaN(targetUC) || targetUC <= 0) {
        alert("올바른 UC 값을 입력하세요.");
        return;
    }

    let packages = [
        { price: 1100, uc: 60, bonus: 0 },
        { price: 4400, uc: 180, bonus: 10 },
        { price: 14000, uc: 600, bonus: 60 },
        { price: 33000, uc: 1500, bonus: 300 },
        { price: 66000, uc: 2950, bonus: 900 },
        { price: 149000, uc: 5900, bonus: 2200 }
    ];

    let bestPrice = Infinity;
    let bestCombo = null;

    function findCombination(index, currentUC, currentPrice, counts) {
        if (currentUC >= targetUC) {
            if (currentPrice < bestPrice) {
                bestPrice = currentPrice;
                bestCombo = counts.slice();
            }
            return;
        }
        if (index >= packages.length || currentPrice >= bestPrice) return;

        let maxCount = Math.ceil((targetUC - currentUC) / (packages[index].uc + packages[index].bonus));
        for (let i = 0; i <= maxCount; i++) {
            counts[index] = i;
            findCombination(
                index + 1,
                currentUC + i * (packages[index].uc + packages[index].bonus),
                currentPrice + i * packages[index].price,
                counts
            );
        }
        counts[index] = 0;
    }

    findCombination(0, 0, 0, new Array(packages.length).fill(0));

    if (bestCombo) {
        let resultText = `<p>최소 가격: <strong>${bestPrice.toLocaleString()}원</strong></p>`;
        resultText += "<p>구매할 패키지:</p><ul>";
        bestCombo.forEach((count, i) => {
            if (count > 0) {
                resultText += `<li>${packages[i].price.toLocaleString()}원 패키지 × ${count}개</li>`;
            }
        });
        resultText += "</ul>";
        document.getElementById("result").innerHTML = resultText;
    } else {
        document.getElementById("result").innerHTML = "적절한 조합을 찾을 수 없습니다.";
    }
}