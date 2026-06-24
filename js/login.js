document.getElementById('loginBtn').addEventListener('click', () => {
    const user = document.getElementById('loginUsername').value;
    const pwd = document.getElementById('loginPassword').value;
    if ((user === 'admin' && pwd === 'admin123') || (user === 'airline_admin' && pwd === 'airline@2024')) {
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid username or password!');
    }
});
document.getElementById('loginPassword').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') document.getElementById('loginBtn').click();
});