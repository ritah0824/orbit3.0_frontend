async function checkAuthStatus() {
    try {
        const response = await fetch(BASE_API + "/getTasks", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        const res = await response.json();
        return res.success && res.data;
    } catch (error) {
        console.error('Auth check failed:', error);
        return false;
    }
}

function login() {
    let name = document.querySelector("#input-login-name").value;
    let password = document.querySelector("#input-login-password").value;

    fetch(BASE_API + "/login?name=" + name + "&password=" + password, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        credentials: 'include'
    })
    .then(response => response.json())
    .then(res => {
        if (res.success) {
            getTasks();
            layerClose();
            
            // Update UI to logged-in state
            document.querySelector("#btn-sign-up").style.display = "none";
            document. querySelector("#btn-log-in").style.display = "none";
            document.querySelector("#btn-log-out").style.display = "inline";
        }
        else {
            document.querySelector("#login-result").innerHTML = res.error;
        }
    })
    .catch(error => {
        console.log(error);
    });
}

function signup() {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let name = document.querySelector("#input-signup-name").value;
    let password = document. querySelector("#input-signup-password").value;
    let confirm = document.querySelector("#input-signup-confirm").value;
    
    if (password != confirm) {
        document.querySelector("#signup-result").innerHTML = "Password doesn't match.";
    }
    else if (!regex.test(name)) {
        document.querySelector("#signup-result").innerHTML = "Email address invalid.";
    }
    else {
        fetch(BASE_API + "/signup?name=" + name + "&password=" + password, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(res => {
            getTasks();
            layerClose();
            
            // Update UI to logged-in state
            document. querySelector("#btn-sign-up").style.display = "none";
            document.querySelector("#btn-log-in").style.display = "none";
            document.querySelector("#btn-log-out").style.display = "inline";
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
            alert('Failed to signup. Please check your connection.');
        });
    }
}

function loginOpen() {
    document.querySelector("#tanceng-wrapper").style.display = "flex";
    document.querySelector("#tanceng-login").style.display = "block";
    document.querySelector("#tanceng-signup").style.display = "none";
    document.querySelector("#input-login-name").value = "";
    document.querySelector("#input-login-password").value = "";
    document.querySelector("#login-result").innerHTML = "";
}

function signupOpen() {
    document.querySelector("#tanceng-wrapper").style.display = "flex";
    document.querySelector("#tanceng-login").style.display = "none";
    document.querySelector("#tanceng-signup").style.display = "block";
    document.querySelector("#input-signup-name").value = "";
    document.querySelector("#input-signup-password").value = "";
    document. querySelector("#input-signup-confirm").value = "";
    document.querySelector("#signup-result").innerHTML = "";
}

function layerClose() {
    document.querySelector("#tanceng-login").style.display = "none";
    document. querySelector("#tanceng-signup").style.display = "none";
    document.querySelector("#tanceng-report").style.display = "none";
    document.querySelector("#tanceng-wrapper").style.display = "none";
}

function report() {
    if (!document.cookie) {
        loginOpen();
        return;
    }
    
    document.querySelector("#tanceng-wrapper").style.display = "flex";
    document.querySelector("#tanceng-report").style.display = "block";
    
    fetch(BASE_API + "/report", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        credentials: 'include'
    })
    .then(response => response.json())
    .then(res => {
        if (res.success) {
            let total = 0;
            let xArray = [];
            let yArray = [];
            for (let i = 0; i < res.data.length; i++) {
                total += res.data[i].recordCount;
                
                // Format date nicely
                const date = new Date(res.data[i].date);
                const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                
                xArray.push(formattedDate);
                yArray.push(res.data[i].recordCount);
            }
            
            // Display total hours (25 min per pomodoro)
            const totalHours = (total * 25 / 60).toFixed(1);
            document.querySelector("#report-total").innerHTML = totalHours + " hours";
            
            // Render chart
            var chart = echarts.init(document.getElementById('layer-chart'));
            var option = {
                backgroundColor: '#ffffff',
                grid: {
                    left: '10%',
                    right: '5%',
                    top: '15%',
                    bottom: '15%'
                },
                xAxis: {
                    type:  'category',
                    data: xArray,
                    axisLabel: {
                        fontSize: 14,
                        color: '#666'
                    }
                },
                yAxis:  {
                    type: 'value',
                    name: 'Pomodoros',
                    nameTextStyle: {
                        fontSize: 14,
                        color: '#666'
                    },
                    axisLabel: {
                        fontSize: 14,
                        color: '#666'
                    }
                },
                series: [{
                    type: 'bar',
                    data: yArray,
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#83bff6' },
                            { offset: 1, color: '#188df0' }
                        ]),
                        borderRadius: [8, 8, 0, 0]
                    },
                    barWidth: '50%',
                    label: {
                        show: true,
                        position: 'top',
                        fontSize: 14,
                        color: '#333',
                        fontWeight: 'bold'
                    }
                }]
            };
            chart. setOption(option);
        }
        else {
            alert("Failed to load report.");
        }
    })
    .catch(error => {
        console.error('Error fetching report:', error);
        alert('Failed to load report. Please check your connection.');
    });
}

function logout() {
    fetch(BASE_API + "/logout", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        credentials:  'include'
    })
    .then(response => response. json())
    .then(res => {
        // Clear tasks
        tasks = [];
        renderTasksDom();
        updateCurrentTaskDisplay();
        
        // Update UI to logged-out state
        document.querySelector("#btn-sign-up").style.display = "inline";
        document. querySelector("#btn-log-in").style.display = "inline";
        document.querySelector("#btn-log-out").style.display = "none";
        
        console. log('✅ Logged out successfully');
    })
    .catch(error => {
        console.error('Logout error:', error);
    });
}

// Initialize on page load
window.onload = async function() {
    const isAuthenticated = await checkAuthStatus();
    
    if (isAuthenticated) {
        // Show logged-in state
        document.querySelector("#btn-sign-up").style.display = "none";
        document.querySelector("#btn-log-in").style.display = "none";
        document.querySelector("#btn-log-out").style.display = "inline";
        
        // Load tasks
        getTasks();
    } else {
        // Show logged-out state
        document.querySelector("#btn-sign-up").style.display = "inline";
        document.querySelector("#btn-log-in").style.display = "inline";
        document.querySelector("#btn-log-out").style.display = "none";
        
        // Clear any stale tasks
        tasks = [];
        renderTasksDom();
    }
}
