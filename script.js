document.addEventListener('DOMContentLoaded', () => {
    const distanceInput = document.getElementById('distance');
    const strideInput = document.getElementById('stride');
    const treadmillCaloriesInput = document.getElementById('treadmillCalories');
    const resultDiv = document.getElementById('result');

    const savedStride = getCookie('stride');
    if (savedStride) {
        strideInput.value = savedStride;
    } else {
        strideInput.value = '82.1'; // デフォルト値
    }

    strideInput.addEventListener('change', () => {
        const stride = parseFloat(strideInput.value);
        if (stride > 0) {
            setCookie('stride', stride, 365);
            calculateSteps();
        }
    });

    distanceInput.addEventListener('input', calculateSteps);
    treadmillCaloriesInput.addEventListener('input', calculateSteps);

    function calculateSteps() {
        const distance = parseFloat(distanceInput.value);
        const stride = parseFloat(strideInput.value);
        const treadmillCalories = parseFloat(treadmillCaloriesInput.value) || 0;
        
        if (distance > 0 && stride > 0) {
            const steps = Math.round((distance * 1000) / (stride / 100));
            const stepCalories = Math.round(steps * 0.03942);
            const calorieDiff = Math.round(treadmillCalories - stepCalories);
            
            let resultText = `${distance} km の歩数は約 ${steps.toLocaleString()} 歩で、<br>歩数で計算した消費カロリーは約 ${stepCalories.toLocaleString()} kcal です`;
            
            if (treadmillCalories > 0) {
                resultText += `<br>トレッドミルの消費カロリーとの差分は ${calorieDiff.toLocaleString()} kcal です`;
                if (calorieDiff > 0) {
                    resultText += `<br>あすけんには ${calorieDiff.toLocaleString()} kcal を入力してください`;
                } else if (calorieDiff < 0) {
                    resultText += `<br>あすけんには ${Math.abs(calorieDiff).toLocaleString()} kcal を引いて入力してください`;
                }
            }
            
            resultDiv.innerHTML = resultText;
        } else {
            resultDiv.innerHTML = '';
        }
    }

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/`;
    }

    function getCookie(name) {
        const nameEQ = `${name}=`;
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
}); 