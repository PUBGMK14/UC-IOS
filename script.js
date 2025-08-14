function handleEnterKey(event) {
    if (event.key === 'Enter') {
        findBestUC();
    }
}

function findBestUC() {
    const input = document.getElementById("ucInput");
    const resultDiv = document.getElementById("result");
    const button = document.getElementById("calculateBtn");
    
    let targetUC = parseInt(input.value);
    
    if (isNaN(targetUC) || targetUC <= 0) {
        showError("올바른 UC 값을 입력해주세요.");
        return;
    }

    // 로딩 상태 표시
    button.innerHTML = '<span class="loading"></span> 계산중...';
    button.disabled = true;
    
    setTimeout(() => {
        try {
            let packages = [
                { price: 1100, uc: 60, bonus: 0 },
                { price: 4400, uc: 180, bonus: 10 },
                { price: 14000, uc: 600, bonus: 60 },
                { price: 33000, uc: 1500, bonus: 300 },
                { price: 66000, uc: 2950, bonus: 900 },
                { price: 149000, uc: 5900, bonus: 2200 }
            ];

            packages = packages.map(p => ({ ...p, totalUC: p.uc + p.bonus }));

            let maxUC = targetUC + Math.max(...packages.map(p => p.totalUC));
            let dp = new Array(maxUC + 1).fill(Infinity);
            let choice = new Array(maxUC + 1).fill(-1);

            dp[0] = 0;

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

            let bestUC = targetUC;
            for (let i = targetUC; i <= maxUC; i++) {
                if (dp[i] < dp[bestUC]) bestUC = i;
            }
            let bestPrice = dp[bestUC];

            let counts = new Array(packages.length).fill(0);
            let cur = bestUC;
            while (cur > 0 && choice[cur] !== -1) {
                let idx = choice[cur];
                counts[idx]++;
                cur -= packages[idx].totalUC;
            }

            let resultHTML = `
                <h3>💰 최적 구매 방법</h3>
                <div class="price-highlight">${bestPrice.toLocaleString()}원 필요</div>
            `;

            let hasPackages = false;
            counts.forEach((count, i) => {
                if (count > 0) {
                    if (!hasPackages) {
                        resultHTML += `
                            <div class="package-list">
                                <h4>📦 구매할 패키지</h4>
                        `;
                        hasPackages = true;
                    }
                    resultHTML += `
                        <div class="package-item">
                            <span class="package-name">${packages[i].price.toLocaleString()}원 패키지</span>
                            <span class="package-count">×${count}개</span>
                        </div>
                    `;
                }
            });

            if (hasPackages) {
                resultHTML += '</div>';
            }

            resultDiv.innerHTML = resultHTML;
            resultDiv.classList.add('show');
            
        } catch (error) {
            showError("계산 중 오류가 발생했습니다.");
        } finally {
            button.innerHTML = '계산하기';
            button.disabled = false;
        }
    }, 500); // 약간의 지연으로 로딩 효과 표시
}

function showError(message) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `<div class="error">${message}</div>`;
    resultDiv.classList.add('show');
    
    const button = document.getElementById("calculateBtn");
    button.innerHTML = '계산하기';
    button.disabled = false;
}

// 초기 포커스 설정
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('ucInput').focus();
});
