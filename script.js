function findBestUC() {
    let targetUC = parseInt(document.getElementById("ucInput").value);
    if (isNaN(targetUC) || targetUC <= 0) {
        alert("올바른 UC 값을 입력하세요.");
        return;
    }

    let packages = [
        { price: 1100, uc: 60, bonus: 0 },
        { price: 3300, uc: 180, bonus: 10 },
        { price: 11000, uc: 600, bonus: 60 },
        { price: 27500, uc: 1500, bonus: 300 },
        { price: 55000, uc: 2950, bonus: 900 },
        { price: 110000, uc: 5900, bonus: 2200 }
    ];

    // UC 합산
    packages = packages.map(p => ({ ...p, totalUC: p.uc + p.bonus }));

    // DP 배열 초기화
    let maxUC = targetUC + Math.max(...packages.map(p => p.totalUC));
    let dp = new Array(maxUC + 1).fill(Infinity);
    let choice = new Array(maxUC + 1).fill(-1);

    dp[0] = 0;

    // DP 채우기
    for (let i = 0; i <= targetUC; i++) {
        if (dp[i] === Infinity) continue;
        for (let idx = 0; idx < packages.length; idx++) {
            let nextUC = i + packages[idx].totalUC;
            let nextPrice = dp[i] + packages[idx].price;
            if (nextUC <= maxUC && nextPrice < dp[nextUC]) {
                dp[nextUC] = nextPrice;
                choice[nextUC] = idx;
            }
        }
    }

    // 최소 가격 찾기
    let bestUC = targetUC;
    for (let i = targetUC; i <= maxUC; i++) {
        if (dp[i] < dp[bestUC]) bestUC = i;
    }
    let bestPrice = dp[bestUC];

    // 조합 복원
    let counts = new Array(packages.length).fill(0);
    let cur = bestUC;
    while (cur > 0 && choice[cur] !== -1) {
        let idx = choice[cur];
        counts[idx]++;
        cur -= packages[idx].totalUC;
    }

    // 결과 출력
    let resultText = `<p>최소 가격: <strong>${bestPrice.toLocaleString()}원</strong></p>`;
    resultText += "<p>구매할 패키지:</p><ul>";
    counts.forEach((count, i) => {
        if (count > 0) {
            resultText += `<li>${packages[i].price.toLocaleString()}원 패키지 × ${count}개</li>`;
        }
    });
    resultText += "</ul>";
    document.getElementById("result").innerHTML = resultText;
}
