document.addEventListener('DOMContentLoaded', () => {
    const checkInBtn = document.getElementById('checkInBtn');
    const checkInsList = document.getElementById('checkIns');
    const totalClassesSpan = document.getElementById('totalClasses');
    const remainingClassesSpan = document.getElementById('remainingClasses');

    const totalClasses = 58;
    let checkIns = [];

    // 从本地存储加载数据
    const loadData = () => {
        const savedCheckIns = localStorage.getItem('checkIns');

        if (savedCheckIns) {
            checkIns = JSON.parse(savedCheckIns);
            updateCheckInList();
        }

        updateRemainingClasses();
    };

    // 保存数据到本地存储
    const saveData = () => {
        localStorage.setItem('checkIns', JSON.stringify(checkIns));
    };

    // 更新剩余课时
    const updateRemainingClasses = () => {
        const remainingClasses = totalClasses - checkIns.length;
        remainingClassesSpan.textContent = remainingClasses;
    };

    // 更新打卡列表
    const updateCheckInList = () => {
        checkInsList.innerHTML = '';
        checkIns.forEach((checkIn, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="check-in-info">
                    <span>第${index + 1}次打卡: ${checkIn.time}</span>
                    ${checkIn.note ? `<div class="note">备注: ${checkIn.note}</div>` : ''}
                </div>
                <div class="check-in-actions">
                    <button class="edit-btn" data-index="${index}">编辑</button>
                    <button class="delete-btn" data-index="${index}">删除</button>
                </div>
            `;
            checkInsList.appendChild(li);
        });

        // 为所有删除和编辑按钮添加事件监听器
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteCheckIn);
        });
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', editCheckIn);
        });
    };

    // 删除打卡记录
    const deleteCheckIn = (event) => {
        const index = event.target.getAttribute('data-index');
        checkIns.splice(index, 1);
        updateCheckInList();
        updateRemainingClasses();
        saveData();
    };

    // 编辑打卡记录
    const editCheckIn = (event) => {
        const index = event.target.getAttribute('data-index');
        const checkIn = checkIns[index];
        const note = prompt('请输入备注:', checkIn.note || '');
        if (note !== null) {
            checkIn.note = note;
            updateCheckInList();
            saveData();
        }
    };

    // 打卡按钮点击事件
    checkInBtn.addEventListener('click', () => {
        if (checkIns.length < totalClasses) {
            const now = new Date();
            const checkInTime = now.toLocaleString('zh-CN');
            checkIns.push({ time: checkInTime, note: '' });

            updateCheckInList();
            updateRemainingClasses();
            saveData();
        } else {
            alert('课时已用完!');
        }
    });

    // 初始化
    totalClassesSpan.textContent = totalClasses;
    loadData();
});